# Lab 1: Go Production — Deploy บน Render + UptimeRobot <Badge type="tip" text="Module 8 · Lab 1" />

> **เป้าหมาย:** เปิด URL สาธารณะ แล้ว Task Tracker ทำงานได้จริงบน internet ✅


## 📋 สิ่งที่ต้องทำ

1. สร้าง account และ Service บน Render
2. ตั้งค่า Environment Variables บน Render
3. เพิ่ม deploy step ใน GitHub Actions pipeline
4. ตั้ง Uptime Monitor บน UptimeRobot
5. ทดสอบ push code → pipeline → deploy อัตโนมัติ


## ขั้นตอนที่ 1 — สร้าง Render Service

### สมัครและ Connect GitHub

1. ไปที่ [render.com](https://render.com) → Sign Up ด้วย GitHub
2. Dashboard → **New → Web Service**
3. Connect GitHub → เลือก repo `task-tracker`

### ตั้งค่า Service

| Field | ค่า |
| :--- | :--- |
| Name | `task-tracker-api` |
| Region | Singapore (asia-southeast1) |
| Branch | `main` |
| Runtime | **Docker** |
| Dockerfile Path | `./Dockerfile` |
| Health Check Path | `/health` |

### Environment Variables

เพิ่มใน Render → Service → **Environment**:

```
PORT         = 3000
NODE_ENV     = production
LOG_LEVEL    = info
```

คลิก **Create Web Service** → รอ 3–5 นาที

URL ที่ได้: `https://task-tracker-api-xxxx.onrender.com`


## ขั้นตอนที่ 2 — ดึง Deploy Hook URL

Render Dashboard → Service → **Settings → Deploy Hooks**

```
https://api.render.com/deploy/srv-xxxxx?key=yyyyyy
```

เพิ่มเป็น GitHub Secret:  
repo → **Settings → Secrets → RENDER_DEPLOY_HOOK**


## ขั้นตอนที่ 3 — เพิ่ม Deploy Step ใน CI/CD

อัปเดต `.github/workflows/cd.yml` ให้มี deploy step:

```yaml
name: CD

on:
  push:
    branches: [main]

jobs:
  build-push:
    name: Build & Push Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image: ${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=latest

      - name: Build and Push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy-production:
    name: Deploy to Render
    needs: build-push
    runs-on: ubuntu-latest
    environment:
      name: production
      url: ${{ vars.PRODUCTION_URL }}

    steps:
      - name: Trigger Render Deploy
        run: |
          echo "🚀 Deploying to production..."
          RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}")
          HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
          if [ "$HTTP_CODE" != "200" ]; then
            echo "❌ Deploy failed with HTTP $HTTP_CODE"
            exit 1
          fi
          echo "✅ Deploy triggered successfully"

      - name: Wait and verify
        run: |
          echo "⏳ Waiting 60s for Render to deploy..."
          sleep 60
          URL="${{ vars.PRODUCTION_URL }}/health"
          STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL" || echo "000")
          if [ "$STATUS" = "200" ]; then
            echo "✅ Production is healthy (HTTP $STATUS)"
          else
            echo "⚠️  Production health check: HTTP $STATUS (may still be starting)"
          fi

      - name: Deploy summary
        run: |
          echo "## 🚀 Deployed to Production" >> $GITHUB_STEP_SUMMARY
          echo "**URL:** ${{ vars.PRODUCTION_URL }}" >> $GITHUB_STEP_SUMMARY
          echo "**Commit:** \`${{ github.sha }}\`" >> $GITHUB_STEP_SUMMARY
          echo "**Time:** $(date -u '+%Y-%m-%d %H:%M:%S UTC')" >> $GITHUB_STEP_SUMMARY
```

เพิ่ม Variable ใน GitHub:  
Settings → **Variables → PRODUCTION_URL** = `https://task-tracker-api-xxxx.onrender.com`


## ขั้นตอนที่ 4 — ตั้ง UptimeRobot

1. ไปที่ [uptimerobot.com](https://uptimerobot.com) → Sign Up ฟรี
2. **Add New Monitor**:
   - Monitor Type: `HTTP(s)`
   - Friendly Name: `Task Tracker Production`
   - URL: `https://task-tracker-api-xxxx.onrender.com/health`
   - Monitoring Interval: `5 minutes`
3. **Alert Contacts** → เพิ่ม email ของตัวเอง
4. **Create Monitor**

ดู Dashboard → ควรเห็น status เปลี่ยนจาก `New` เป็น `Up` ✅

::: warning Render Free Tier Cold Start
Render ฟรี tier หยุด service หลัง 15 นาทีที่ไม่มี traffic  
UptimeRobot ping ทุก 5 นาที → ทำให้ service ไม่ sleep (ข้อดีรอง)
:::


## ขั้นตอนที่ 5 — ทดสอบ Full Flow

```bash
# แก้ไข code เล็กน้อย
echo "// tested deploy $(date)" >> src/app.ts

# Commit + Push
git add .
git commit -m "chore: test auto deploy to production"
git push origin main
```

ดู GitHub Actions:
```
CD
├── ✅ Build & Push Image     (2-3 min)
└── ✅ Deploy to Render       (1 min + 60s verify)
```

ทดสอบ endpoint:
```bash
curl https://task-tracker-api-xxxx.onrender.com/health
# {"status":"ok","uptime":120,"version":"1.0.0",...}

curl https://task-tracker-api-xxxx.onrender.com/api/tasks
# {"data":[...],"total":3}
```


## ✅ เกณฑ์การส่งงาน Lab 1

| รายการ | คะแนน |
| :--- | :---: |
| Render service รัน app ได้จาก public URL | 2 |
| GitHub Actions deploy อัตโนมัติเมื่อ push to main | 2 |
| UptimeRobot monitor ตั้งค่าและแสดง "Up" | 1 |
| **รวม** | **5** |

**ส่ง:**
1. URL ของ Task Tracker บน Render (ต้องเปิดได้จริง)
2. Screenshot GitHub Actions run ✅ (build + deploy)
3. Screenshot UptimeRobot dashboard แสดง monitor "Up"


**← ก่อนหน้า:** [Documentation as Code](/wk8/wk8-content6-documentation-code)  
**ถัดไป →** [Lab 2: Monitoring Setup](/wk8/wk8-lab2-monitoring-setup)
