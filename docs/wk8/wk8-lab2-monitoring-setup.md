# Lab 2: Monitoring Setup — Health Check + Runbook <Badge type="tip" text="Module 8 · Lab 2" />

> **เป้าหมาย:** ระบบแจ้งเตือนอัตโนมัติเมื่อ app มีปัญหา + มี runbook พร้อมใช้ ✅


## 📋 สิ่งที่ต้องทำ

1. อัปเดต `/health` endpoint ให้คืนข้อมูลครบ
2. เพิ่ม Structured Logging ด้วย Pino
3. ตั้ง UptimeRobot Monitor + Email Alert
4. เขียน Runbook 1 หน้าสำหรับ Task Tracker
5. ทดสอบ: หยุด app แล้วดู alert


## ขั้นตอนที่ 1 — อัปเดต Health Endpoint

```typescript
// src/app.ts — อัปเดต /health endpoint
const startTime = Date.now()

app.get('/health', (_req, res) => {
  const uptimeSeconds = Math.floor((Date.now() - startTime) / 1000)
  const memUsed = Math.round(process.memoryUsage().heapUsed / 1024 / 1024)

  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: uptimeSeconds,
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: memUsed,
      unit: 'MB',
    },
  })
})
```

ทดสอบ local:
```bash
npm run dev &
curl http://localhost:3000/health | jq .
```

ผลลัพธ์ที่ต้องได้:
```json
{
  "status": "ok",
  "timestamp": "2025-04-18T08:00:00.000Z",
  "uptime": 120,
  "version": "1.0.0",
  "environment": "production",
  "memory": {
    "used": 45,
    "unit": "MB"
  }
}
```


## ขั้นตอนที่ 2 — เพิ่ม Structured Logging

### 2.1 ติดตั้ง Packages

```bash
npm install pino pino-pretty
```

### 2.2 สร้างไฟล์ `src/logger.ts`

**ให้นักเรียนสร้างไฟล์ใหม่ชื่อ `src/logger.ts` แล้วก๊อปปี้โค้ดนี้ไปวาง:**

```typescript
// src/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,
})
```

### 2.3 อัปเดต `src/app.ts` เพื่อใช้ Logger

เปิดไฟล์ `src/app.ts` แล้วเพิ่ม import บรรทัดนี้ไว้ด้านบนสุด:
```typescript
import { logger } from './logger'
```

จากนั้นเพิ่ม Middleware 2 ตัวนี้ **ก่อนที่จะถึง `app.use('/tasks', taskRouter)`**:

```typescript
// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: Date.now() - start,
    }, 'HTTP request')
  })
  next()
})

// Error logging (ไว้ล่างสุดก่อน module.exports)
app.use((err: Error, _req: any, res: any, _next: any) => {
  logger.error({ err: err.message, stack: err.stack }, 'Unhandled error')
  res.status(500).json({ error: 'Internal server error' })
})
```

### 2.4 ทดสอบ Logger

**สำคัญ:** ทดสอบรันแอปดูก่อนไปขั้นต่อไป ว่าโค้ดที่แก้ไม่พัง

1. รันแอปใน Terminal ที่ 1:
```bash
npm run dev
```

2. เปิดอีก Terminal เพื่อส่ง request ทดสอบ:
```bash
curl http://localhost:3000/api/tasks
```

3. กลับมาดูที่ Terminal 1 จะต้องเห็น Log สวยงามแบบนี้ (กด Ctrl+C เพื่อหยุดเมื่อพอใจแล้ว):
```
[09:00:01.234] INFO: HTTP request
  method: "GET"
  path: "/api/tasks"
  statusCode: 200
  duration: 12
```


## ขั้นตอนที่ 3 — ตั้ง UptimeRobot Monitor

### Monitor 1: Production Health Check

1. [uptimerobot.com](https://uptimerobot.com) → **Add New Monitor**
2. ตั้งค่า:

| Field | ค่า |
| :--- | :--- |
| Monitor Type | HTTP(s) |
| Friendly Name | Task Tracker — Production |
| URL | `https://task-tracker-api-xxxx.onrender.com/health` |
| Monitoring Interval | 5 minutes |
| Alert Contacts | email ของคุณ |

3. **Advanced Settings:**
   - Keyword: `"status":"ok"` (ถ้าไม่เจอ keyword นี้ → alert)

### ทดสอบ Alert ทำงาน

ไปที่ Render → Service → **Suspend Service** (จำลองการล่ม)  
รอ 5-10 นาที → ต้องรับ email alert:

```
Subject: 🔴 [DOWN] Task Tracker — Production

Your monitor is down!
URL: https://task-tracker-api-xxxx.onrender.com/health
Down since: April 18, 2025 08:00:00 UTC
```

ไปที่ Render → **Resume Service** → รอ start  
ไม่นานก็จะได้รับ email อีกอัน:

```
Subject: ✅ [UP] Task Tracker — Production (was down for 8 minutes)
```


## ขั้นตอนที่ 4 — เขียน Runbook สำหรับ Task Tracker

สร้าง folder และไฟล์:

```bash
mkdir -p docs/runbooks
touch docs/runbooks/api-down.md
touch docs/runbooks/deploy-rollback.md
```

### `docs/runbooks/api-down.md`

```markdown
# Runbook: Task Tracker API ไม่ตอบสนอง

**Severity:** P1
**Owner:** @DevOps Student
**Last Updated:** 2025-04-18

## Symptoms
- UptimeRobot alert: Task Tracker is DOWN
- GET /health ตอบ timeout หรือ 5xx
- Users รายงานว่าใช้งานไม่ได้

## Step-by-Step Investigation

### 1. ตรวจสอบสถานะบน Render
   - เปิด [dashboard.render.com](https://dashboard.render.com)
   - ดูที่ Service → Events tab
   - มี crash หรือ OOM เกิดขึ้นไหม?

### 2. ตรวจสอบ Health Endpoint
   ```bash
   curl -v https://task-tracker-api-xxxx.onrender.com/health
   ```
   - 200 + `{"status":"ok"}` → app รัน ปัญหาอยู่ที่อื่น
   - timeout / connection refused → app ไม่รัน
   - 503 → Render routing มีปัญหา

### 3. ดู Logs
   Render Dashboard → Service → **Logs** tab
   
   ค้นหา:
   - `ERROR` หรือ `FATAL`
   - `OOMKilled` (Out of Memory)
   - `ECONNREFUSED` (DB connection)

## Resolution

### Case A: Deploy ล่าสุดทำให้พัง
   1. Render → Deploys → คลิก deploy ก่อนหน้า
   2. คลิก **Redeploy**
   3. รอ 2-3 นาที → ตรวจ /health

### Case B: Service หยุดทำงาน (OOM หรือ crash)
   1. Render → Service → **Manual Deploy**
   2. (บังคับ restart container)

### Case C: Render platform มีปัญหา
   ดู status ที่ [status.render.com](https://status.render.com)

## Verification
```bash
for i in {1..3}; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://task-tracker-api-xxxx.onrender.com/health)
  echo "Attempt $i: HTTP $STATUS"
  sleep 5
done
```
ต้องได้ `200` ทั้งสามครั้ง

## Escalation
ถ้าแก้ไม่ได้ใน **30 นาที** → แจ้ง @senior-engineer
```

### `docs/runbooks/deploy-rollback.md`

```markdown
# Runbook: Rollback Deploy

**เมื่อไหร่ใช้:** deploy ใหม่ไปแล้วและพบปัญหาในทันที

## ขั้นตอน

1. ไปที่ Render Dashboard → Service → **Deploys**
2. หา deploy ก่อนหน้าที่ทำงานดี (มีไอคอน ✅)
3. คลิก **Redeploy**
4. ยืนยัน → รอ 2-3 นาที
5. ตรวจ `/health`

## หลัง Rollback
- เปิด GitHub Issue บันทึกว่าทำไมต้อง rollback
- สร้าง PR แก้ bug แล้วทดสอบก่อน merge ครั้งต่อไป
```


## ขั้นตอนที่ 5 — Commit และ Push Runbook

```bash
git add docs/runbooks/
git commit -m "docs: add runbooks for API down and deploy rollback"
git push origin main
```


## ✅ เกณฑ์การส่งงาน Lab 2

| รายการ | คะแนน |
| :--- | :---: |
| `/health` endpoint คืน JSON ครบ (status, uptime, version, memory) | 1 |
| Structured logging ด้วย Pino (request log เห็นใน Render Logs) | 1 |
| UptimeRobot monitor ตั้งค่าพร้อม keyword check + email alert | 1.5 |
| Runbook ครบ 2 ไฟล์ (`api-down.md` + `deploy-rollback.md`) | 1.5 |
| **รวม** | **5** |

**ส่ง:**
1. Screenshot UptimeRobot แสดง monitor "Up" พร้อม keyword check
2. Screenshot email alert ที่ได้รับเมื่อหยุด service
3. Link ไฟล์ runbook ใน GitHub repo


**← ก่อนหน้า:** [Lab 1: Go Production](/wk8/wk8-lab1-production)  
**Module ถัดไป →** [Module 9: DevOps Next Steps](/wk9/wk9-content1-devops-next)
