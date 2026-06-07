# Cloud Deployment — 12-Factor App & Render <Badge type="info" text="Module 8 · สัปดาห์ 15–16" />

> **Ref Book:** Beyond the 12-Factor App — All chapters

::: info 📌 ทบทวนจาก Module ก่อนหน้า
**Module 7:** เพิ่ม Unit Test + SIT เข้า CI pipeline — code ที่ test ไม่ผ่านถูก block อัตโนมัติ ✅  
**Module 8 นี้:** นำ app ที่ test ผ่านแล้ว **deploy ขึ้น production จริง** บน Cloud พร้อม Monitoring
:::

## 🚀 Cloud Platforms สำหรับ Deploy ฟรี

| Platform | รองรับ | Free Tier | เหมาะกับ |
| :--- | :--- | :--- | :--- |
| **Render** | Docker, Node, Python | ✅ Web Service ฟรี | ✅ ใช้ใน course |
| **Railway** | Docker, ทุก language | ✅ $5 credit/เดือน | Prototype |
| **Fly.io** | Docker | ✅ 3 VM ฟรี | ต้องการ custom config |
| **Vercel** | Next.js, Static | ✅ ฟรี | Frontend |


## 📐 12-Factor App Methodology

**12-Factor** คือชุดหลักการสร้าง app สำหรับ cloud ที่ scale ได้ดี เขียนโดย Heroku (2011)

เรียน 3 Factor สำคัญที่สุดสำหรับ DevOps:

### Factor I: Codebase — One repo, many deploys

```
❌ แบบผิด:
  backend/   ← repo แยก
  frontend/  ← repo แยก
  infra/     ← repo แยก
  → sync ยาก, version ไม่ตรงกัน

✅ แบบถูก: Monorepo หรือแยก repo ต่อ service แต่แต่ละ repo deploy ได้หลาย environment
  task-tracker/ (single repo)
    ├── deploy to: local
    ├── deploy to: staging.render.com
    └── deploy to: prod.render.com
```

### Factor III: Config — Store in Environment

```typescript
// ❌ แบบผิด: config อยู่ใน code
const DB_URL = 'postgres://admin:pass@prod-db:5432/app'
const PORT = 3000

// ✅ แบบถูก: อ่านจาก environment variables
const DB_URL = process.env.DATABASE_URL
const PORT = Number(process.env.PORT) || 3000
```

::: tip กฎง่ายๆ: Config ที่ต่างกันระหว่าง environment → ต้องเป็น env var เสมอ
:::

### Factor XI: Logs — Treat as Event Streams

```typescript
// ❌ แบบผิด: log ไปไฟล์ (ใน container ไฟล์หายเมื่อ restart)
const logger = winston.createLogger({
  transports: [new winston.transports.File({ filename: 'app.log' })]
})

// ✅ แบบถูก: log ไป stdout เสมอ — platform จัดการเอง
const logger = winston.createLogger({
  transports: [new winston.transports.Console()]
})

// หรือใช้ pino ซึ่ง log ไป stdout by default
import pino from 'pino'
const log = pino()
log.info({ taskId: 1 }, 'Task created')
```


## 🌍 Deploy Task Tracker บน Render

### ตั้งค่า Render Service

1. Render Dashboard → **New → Web Service**
2. Connect GitHub repo
3. เลือก: **"Deploy from existing image"** หรือ **"Build from source"**

ถ้า Build from source:
- Environment: `Node`
- Build Command: `npm ci && npm run build`
- Start Command: `node dist/index.js`

### ตั้งค่า Environment Variables บน Render

Render Dashboard → Service → **Environment**:

```
PORT         = 3000
NODE_ENV     = production
DATABASE_URL = postgres://...  (จาก Render PostgreSQL Add-on)
JWT_SECRET   = $(generate random string)
```

::: warning อย่าตั้ง env var ใน Dockerfile สำหรับ sensitive values
ตั้งบน Render dashboard เพื่อให้ค่าไม่อยู่ใน image
:::


## ⚡ Zero-Downtime Deployment

Render ทำ rolling deployment ให้อัตโนมัติ:

```mermaid
graph TD
    B[1. Build image ใหม่] --> S[2. Start container ใหม่]
    S --> H[3. Health check จนผ่าน]
    H --> R[4. Route traffic ไป container ใหม่]
    R --> D[5. Stop container เก่า]
```

### Rollback บน Render

Dashboard → Service → **Deploys** → คลิก deploy เก่า → **Redeploy**

หรือทำจาก GitHub Actions:

```yaml
- name: Rollback on failure
  if: failure()
  run: |
    echo "Deploy failed, triggering rollback..."
    # Render API rollback (ต้องมี API key)
    curl -X POST "https://api.render.com/v1/services/$RENDER_SERVICE_ID/deploys" \
      -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}" \
      -H "Content-Type: application/json" \
      -d '{"imageUrl": "ghcr.io/${{ github.repository }}:prev"}'
```


## 🔄 Container Registry → Cloud Deploy Workflow

```mermaid
graph TD
    Local[Local: git push] --> GitHub[GitHub CI: test + lint + build image]
    GitHub --> GHCR[GHCR: Push image ghcr.io/user/task-tracker]
    GHCR --> Render[Render: Pull image → deploy → health check → live]
    Render --> URL[URL: https://task-tracker.onrender.com ✅]
```


## 💡 สรุป

::: info 12-Factor ที่ต้องทำในโปรเจกต์ Task Tracker
| Factor | การปฏิบัติ |
| :--- | :--- |
| I: Codebase | 1 GitHub repo, deploy หลาย environment |
| III: Config | ทุก secret/config → environment variable |
| XI: Logs | log ไป stdout เสมอ, ไม่เขียนไฟล์ |
:::


**← ก่อนหน้า:** [Lab wk7: Test Pipeline](/wk7/wk7-lab1-test-pipeline)  
**ถัดไป →** [Monitoring & Logging](/wk8/wk8-content2-monitoring)
