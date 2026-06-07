# Lab 2: Multi-Environment Pipeline + README Badge <Badge type="tip" text="Module 6 · Lab 2" />

> **เป้าหมาย:** badge สีเขียวบน README + pipeline แยก staging/production ชัดเจน ✅


## 📋 สิ่งที่ต้องทำ

1. สร้าง GitHub Environment `staging` และ `production`
2. ตั้งค่า Deploy Hook บน Render
3. อัปเดต `cd.yml` ให้ deploy staging → smoke test → production
4. เพิ่ม README badge
5. ตั้งค่า Dependabot
6. ทดสอบ full pipeline


## ขั้นตอนที่ 1 — สร้าง Environments บน GitHub

ไปที่ repo → **Settings → Environments → New environment**

### สร้าง `staging`

- Name: `staging`
- ไม่ต้องตั้ง Protection rules

### สร้าง `production`

- Name: `production`
- ✅ **Required reviewers** → เพิ่มชื่อครู
- ✅ **Prevent self-review**
- Wait timer: `5` minutes (optional)


## ขั้นตอนที่ 2 — ตั้งค่า Render Deploy Hook

### สร้าง Render Service (ถ้ายังไม่มี)

1. ไปที่ [render.com](https://render.com) → **New → Web Service**
2. เลือก **Deploy an existing image from a registry**
3. Image URL: `ghcr.io/YOUR_USERNAME/task-tracker:latest`
4. ตั้ง Environment variables จาก `.env.example`
5. คลิก **Create Web Service**

### ดึง Deploy Hook URL

Render Dashboard → Service → **Settings → Deploy Hook**

```
https://api.render.com/deploy/srv-xxxxx?key=yyyyyyy
```

### เพิ่ม Secret ใน GitHub

Settings → Secrets → Actions → **New secret**

| Secret | ค่า |
| :--- | :--- |
| `RENDER_STAGING_HOOK` | Staging service deploy hook URL |
| `RENDER_PRODUCTION_HOOK` | Production service deploy hook URL |

### เพิ่ม Variables (GitHub Variables ≠ Secrets)

::: info Variables vs Secrets
- **Secrets** = ค่าที่อ่านไม่ได้ใน logs (เช่น password, API key)
- **Variables** = ค่าที่เห็นได้ใน logs (เช่น URL, ชื่อ environment)

Workflow ใช้ `vars.STAGING_URL` (ไม่ใช่ secrets) ดังนั้นต้องตั้งใน Variables tab
:::

Settings → Secrets and variables → Actions → แบบ **Variables** (tab) → **New variable**

| Variable | ค่า |
| :--- | :--- |
| `STAGING_URL` | `https://task-tracker-staging.onrender.com` |
| `PRODUCTION_URL` | `https://task-tracker.onrender.com` |

::: warning URL ด้านบนต้องแก้ให้ตรงกับชื่อ service จริงบน Render — ดูได้จาก Render Dashboard
:::

## ขั้นตอนที่ 3 — อัปเดต CD Workflow ให้แยก Environment

```yaml
# .github/workflows/cd.yml
name: CD — Deploy Pipeline

on:
  push:
    branches: [main]

jobs:
  # ── 1. Build & Push Image ─────────────────────────────────
  build-push:
    name: Build & Push Docker Image
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write
    outputs:
      image-tag: ${{ steps.meta.outputs.version }}

    steps:
      - uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=latest

      - name: Build and push
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ── 2. Deploy to Staging ──────────────────────────────────
  deploy-staging:
    name: Deploy to Staging
    needs: build-push
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: ${{ vars.STAGING_URL }}

    steps:
      - name: Trigger staging deploy
        run: |
          echo "🔵 Deploying to staging..."
          curl -fsSL -X POST "${{ secrets.RENDER_STAGING_HOOK }}"
          echo "✅ Staging deploy triggered"

  # ── 3. Smoke Test Staging ─────────────────────────────────
  smoke-test-staging:
    name: Smoke Test Staging
    needs: deploy-staging
    runs-on: ubuntu-latest

    steps:
      - name: Wait for service to start
        run: |
          echo "⏳ Waiting 60s for Render to start..."
          sleep 60

      - name: Health check
        run: |
          URL="${{ vars.STAGING_URL }}/health"
          echo "Checking $URL ..."
          for i in {1..5}; do
            STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$URL" || echo "000")
            if [ "$STATUS" = "200" ]; then
              echo "✅ Staging is healthy (attempt $i)"
              exit 0
            fi
            echo "⚠️  Attempt $i: status=$STATUS — retrying in 15s..."
            sleep 15
          done
          echo "❌ Staging health check failed after 5 attempts"
          exit 1

  # ── 4. Deploy to Production ───────────────────────────────
  deploy-production:
    name: Deploy to Production
    needs: smoke-test-staging
    runs-on: ubuntu-latest
    environment:
      name: production           # ← รอ reviewer approve ก่อน!
      url: ${{ vars.PRODUCTION_URL }}

    steps:
      - name: Trigger production deploy
        run: |
          echo "🚀 Deploying to production..."
          curl -fsSL -X POST "${{ secrets.RENDER_PRODUCTION_HOOK }}"
          echo "✅ Production deploy triggered"

      - name: Job summary
        run: |
          echo "## 🚀 Production Deployed!" >> $GITHUB_STEP_SUMMARY
          echo "- **Commit:** \`${{ github.sha }}\`" >> $GITHUB_STEP_SUMMARY
          echo "- **URL:** ${{ vars.PRODUCTION_URL }}" >> $GITHUB_STEP_SUMMARY
```

### เพิ่ม Variables (ไม่ใช่ Secrets)

Settings → Secrets → **Variables** → New variable:

| Variable | ค่า |
| :--- | :--- |
| `STAGING_URL` | `https://task-tracker-staging.onrender.com` |
| `PRODUCTION_URL` | `https://task-tracker.onrender.com` |


## ขั้นตอนที่ 4 — เพิ่ม README Badge

Badge แสดงสถานะ CI/CD ล่าสุดบน README

```markdown
<!-- README.md — เพิ่มหลัง title -->
# Task Tracker API

![CI](https://github.com/YOUR_USERNAME/task-tracker/actions/workflows/ci.yml/badge.svg)
![CD](https://github.com/YOUR_USERNAME/task-tracker/actions/workflows/cd.yml/badge.svg)
![Docker](https://img.shields.io/badge/docker-ready-blue?logo=docker)
![Node.js](https://img.shields.io/badge/node-20_LTS-green?logo=node.js)
```

แทนที่ `YOUR_USERNAME` ด้วย GitHub username จริง

ผลลัพธ์: README จะแสดง badge สีเขียว/แดงตามสถานะ pipeline ล่าสุด


## ขั้นตอนที่ 5 — ตั้งค่า Dependabot

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "09:00"
      timezone: "Asia/Bangkok"
    open-pull-requests-limit: 5
    labels: ["dependencies", "automated"]
    commit-message:
      prefix: "chore"

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels: ["ci", "automated"]
    commit-message:
      prefix: "ci"
```


## ขั้นตอนที่ 6 — ทดสอบ Full Pipeline

```bash
# Commit ทั้งหมด
git add .github/ README.md
git commit -m "ci: add multi-environment CD pipeline + README badges"
git push origin main
```

ดู Actions tab → ควรเห็น sequence:

```
CD — Deploy Pipeline
├── ✅ Build & Push Docker Image    (2 min)
├── ✅ Deploy to Staging            (30 sec)
├── ✅ Smoke Test Staging           (1.5 min)
└── ⏳ Deploy to Production         ← รอ reviewer approve
```

### Approve Production Deploy

ไปที่ Actions → CD run → **Review deployments → production → Approve and deploy**

```
Deploy to Production
└── ✅ Trigger production deploy    (30 sec)
```


## ขั้นตอนที่ 7 — ทดสอบ: Push to Feature Branch (ต้องไม่ CD)

```bash
git switch -c feat/test-no-cd
git commit --allow-empty -m "test: verify CD not triggered on feature branch"
git push origin feat/test-no-cd
```

ใน Actions tab:
- ✅ CI รัน (เพราะ push ทุก branch)
- ❌ CD **ไม่รัน** (เพราะ trigger เฉพาะ main)


## ขั้นตอนที่ 8 — ปิด Service Staging (ประหยัดโควต้า Render) ⏸️

::: warning สำคัญมาก: ป้องกันโควต้าหมด!
Render แบบฟรีมีโควต้าให้ใช้งาน **750 ชั่วโมง/เดือน**  
ถ้ารันทั้ง `staging` และ `production` คู่กันตลอดเวลา โควต้าจะหมดใน 15 วัน! (750 / 2 / 24 = 15.6 วัน)
:::

หลังจากทำ Lab และส่งงานเสร็จแล้ว ให้เข้าไปปิด (Suspend) Service ตัว Staging:
1. เปิด **Render Dashboard**
2. คลิกเลือก Service `task-tracker-staging`
3. ไปที่มุมบนขวา คลิกปุ่ม **Suspend Web Service** (หรือหาที่เมนู Settings)
4. กดยืนยัน

*เมื่อจะส่งงานหรือทำ Lab ถัดไป ค่อยเข้ามากด Resume Service ให้มันทำงานต่อ*


## ✅ เกณฑ์การส่งงาน Lab 2


| รายการ | คะแนน |
| :--- | :---: |
| Pipeline แยก staging → smoke test → production production ชัดเจน | 1.5 |
| Production environment มี Required reviewer | 1 |
| README badge CI/CD สีเขียว | 1 |
| Dependabot `.github/dependabot.yml` ตั้งค่าถูกต้อง | 0.5 |
| Feature branch push → CD ไม่รัน | 1 |
| **รวม** | **5** |

**ส่ง:**
1. Screenshot pipeline run ที่ผ่านทุก stage (รวม production approve)
2. Screenshot README ที่มี badge สีเขียว
3. Link ของ GitHub Actions run


**← ก่อนหน้า:** [Lab 1: Build Pipeline](/wk6/wk6-lab1-pipeline)  
**Module ถัดไป →** [Module 7: Testing & Quality](/wk7/wk7-content0-testing-strategy)
