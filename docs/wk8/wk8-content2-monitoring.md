# Monitoring & Logging — Observability <Badge type="info" text="Module 8 · สัปดาห์ 15–16" />

> **Ref Book:** The DevOps Handbook — Part IV: Feedback


## 👁️ Observability — รู้ว่าระบบเป็นอย่างไร

**Observability** = ความสามารถในการเข้าใจสถานะภายในระบบจากข้อมูลภายนอก

**3 Pillars of Observability:**

| Logs | Metrics | Traces |
| :--- | :--- | :--- |
| "เกิดอะไร" | "ระบบสุขภาพดีไหม" | "request ผ่านที่ไหน" |

| Pillar | ตัวอย่าง | Tool |
| :--- | :--- | :--- |
| **Logs** | `ERROR: DB connection failed at 09:23:01` | Pino, Winston, Render Logs |
| **Metrics** | CPU 45%, RAM 200MB, RPS 150 | Render Dashboard, UptimeRobot |
| **Traces** | request A → route → service → db (150ms total) | OpenTelemetry (advanced) |

> ใน course นี้เน้น **Logs + Metrics** ซึ่งทำได้ทันทีโดยไม่ต้องติดตั้ง tools ซับซ้อน


## 📋 Structured Logging — JSON ดีกว่า Plain Text

```typescript
// ❌ Plain text log — ค้นหายาก, parse ยาก
console.log('User 123 created task "เรียน DevOps" at 2025-04-17')
console.log('ERROR: task not found id=456')

// ✅ Structured JSON log — ค้นหาง่าย, machine-readable
import pino from 'pino'
const log = pino({ level: 'info' })

log.info({ userId: 123, taskId: 789, action: 'create' }, 'Task created')
// {"level":30,"time":1713333600,"msg":"Task created","userId":123,"taskId":789}

log.error({ taskId: 456, error: 'Not Found' }, 'Task lookup failed')
// {"level":50,"time":1713333601,"msg":"Task lookup failed","taskId":456,"error":"Not Found"}
```

### ติดตั้ง Pino

```bash
npm install pino pino-pretty
```

```typescript
// src/logger.ts
import pino from 'pino'

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV !== 'production'
      ? { target: 'pino-pretty', options: { colorize: true } }
      : undefined,                  // production: JSON ล้วน
})
```

### ใช้ใน Express

```typescript
// src/app.ts
import { logger } from './logger'

app.post('/api/tasks', (req, res) => {
  const { title } = req.body

  logger.info({ title }, 'Creating new task')

  try {
    const task = createTask(title)
    logger.info({ taskId: task.id }, 'Task created successfully')
    res.status(201).json(task)
  } catch (err) {
    logger.error({ err, title }, 'Failed to create task')
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Request logging middleware
app.use((req, _res, next) => {
  logger.info({ method: req.method, path: req.path }, 'Incoming request')
  next()
})
```


## 🏥 Health Check Endpoint — มาตรฐาน

```typescript
// src/app.ts — Health check ที่ดีต้องบอกมากกว่าแค่ "ok"

const startTime = Date.now()

app.get('/health', (_req, res) => {
  const uptime = Math.floor((Date.now() - startTime) / 1000)

  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: uptime,               // วินาทีที่รันมา
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      unit: 'MB',
    },
  })
})

// ทดสอบ
// curl http://localhost:3000/health
// {
//   "status": "ok",
//   "timestamp": "2025-04-17T09:00:00.000Z",
//   "uptime": 3600,
//   "version": "1.0.0",
//   "environment": "production",
//   "memory": { "used": 45, "unit": "MB" }
// }
```


## 📡 Uptime Monitoring ฟรี — UptimeRobot

**UptimeRobot** ping URL ของ app ทุก 5 นาที — ถ้าตอบไม่ได้ส่ง alert ทันที

### ตั้งค่า

1. ไปที่ [uptimerobot.com](https://uptimerobot.com) → สมัครฟรี
2. **Add New Monitor**:
   - Monitor Type: **HTTP(s)**
   - Friendly Name: `Task Tracker Production`
   - URL: `https://task-tracker.onrender.com/health`
   - Monitoring Interval: **5 minutes**
3. **Alert Contacts**: เพิ่ม email ของตัวเอง

### Alert ที่ได้รับ

```
Subject: 🔴 [DOWN] Task Tracker Production is down

Your monitor "Task Tracker Production" is down!
URL: https://task-tracker.onrender.com/health
Down since: April 17, 2025 09:35:00 UTC
Response code: 503
```


## 🔍 อ่าน Logs บน Render

Render Dashboard → Service → **Logs** แท็บ

```
2025-04-17 09:00:01  INFO  🚀 Task Tracker running on port 3000
2025-04-17 09:00:15  INFO  {"method":"GET","path":"/api/tasks"} Incoming request
2025-04-17 09:01:23  INFO  {"userId":1,"taskId":5} Task created successfully
2025-04-17 09:02:45  ERROR {"taskId":999,"err":"Not Found"} Task lookup failed
```

ค้นหา log:
```bash
# Filter เฉพาะ ERROR
# (ในช่อง search ของ Render Logs UI)
level: error

# หรือ curl แล้ว grep
curl https://task-tracker.onrender.com/api/tasks 2>&1 | grep -i error
```


## 📊 MTTR — Mean Time to Recovery

**MTTR** คือเวลาเฉลี่ยในการกู้คืนระบบหลังเกิด incident — DORA metric ที่สำคัญ

```
MTTR = (เวลาที่ fix เสร็จ) - (เวลาที่ detect ปัญหา)

ดี:     MTTR < 1 ชั่วโมง
ปกติ:  MTTR 1-4 ชั่วโมง
แย่:   MTTR > 1 วัน
```

Monitoring ที่ดีช่วยลด MTTR เพราะ:
- Detect เร็ว (UptimeRobot alert ภายใน 5 นาที)
- Log ครบ (รู้สาเหตุได้เร็ว)
- Runbook ชัดเจน (fix ได้เร็ว)


## 💡 สรุป

::: info Observability ขั้นต่ำสำหรับ Task Tracker
| สิ่งที่ต้องทำ | เครื่องมือ |
| :--- | :--- |
| Structured logging | Pino + JSON format |
| `/health` endpoint | Express route |
| Uptime monitoring | UptimeRobot (ฟรี) |
| Alert | Email จาก UptimeRobot |
| Log access | Render dashboard |
:::


**← ก่อนหน้า:** [Cloud Deployment](/wk8/wk8-content1-deployment)  
**ถัดไป →** [SLI / SLO / SLA](/wk8/wk8-content3-slo-sla)
