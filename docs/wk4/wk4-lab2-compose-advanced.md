# Lab 2: Docker Compose Advanced — healthcheck & depends_on <Badge type="tip" text="Module 4 · Lab 2" />

> **เป้าหมาย:** `docker compose ps` แสดง `(healthy)` สำหรับทุก service ✅


## 📋 สิ่งที่ต้องทำ

1. เพิ่ม `healthcheck` ให้ครบทุก service
2. ตั้งค่า `depends_on` ให้ถูกลำดับ
3. สร้าง `docker-compose.override.yml` สำหรับ dev mode
4. ทดสอบ: หยุด service แล้วดู health status เปลี่ยน


## ขั้นตอนที่ 1 — ทำความเข้าใจ healthcheck

Healthcheck คือ Docker ทดสอบสุขภาพของ container อัตโนมัติ

```
Container status:
  starting    → รอ start_period แล้วเริ่มเช็ค
  healthy     → healthcheck ผ่านตาม retries
  unhealthy   → healthcheck fail เกิน retries
```

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s      # เช็คทุก 30 วินาที
  timeout: 10s       # timeout แต่ละครั้ง
  retries: 3         # fail กี่ครั้งถึงจะ unhealthy
  start_period: 10s  # รอให้ app start ก่อนเริ่มเช็ค
```


## ขั้นตอนที่ 2 — เพิ่ม /health Endpoint ใน App

ถ้ายังไม่มี endpoint `/health` ใน `src/index.ts` ให้เพิ่ม:

```typescript
// src/index.ts — เพิ่ม health endpoint
app.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  })
})
```

Rebuild image:

```bash
docker compose build api
```


## ขั้นตอนที่ 3 — อัพเดต docker-compose.yml ให้ครบ

สร้าง `docker-compose.yml` ใหม่ที่มี healthcheck, depends_on และ db:

```yaml
# docker-compose.yml
services:

  # ── Database ───────────────────────────────────────────────
  db:
    image: postgres:15-alpine
    container_name: task-tracker-db
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-taskdb}
      POSTGRES_USER: ${POSTGRES_USER:-admin}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-changeme}
    volumes:
      - db-data:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-admin} -d ${POSTGRES_DB:-taskdb}"]
      interval: 10s
      timeout: 5s
      retries: 5
      start_period: 10s

  # ── API ────────────────────────────────────────────────────
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    image: task-tracker:latest
    container_name: task-tracker-api
    ports:
      - "${PORT:-3000}:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgres://${POSTGRES_USER:-admin}:${POSTGRES_PASSWORD:-changeme}@db:5432/${POSTGRES_DB:-taskdb}
    env_file:
      - .env
    depends_on:
      db:
        condition: service_healthy   # รอ db healthy ก่อน start api
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:3000/health || exit 1"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 15s

volumes:
  db-data:
```

สร้าง `.env` (สำหรับ local dev):

```bash
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
POSTGRES_DB=taskdb
POSTGRES_USER=admin
POSTGRES_PASSWORD=dev-password-local
EOF
```

::: warning อย่าลืมใส่ .env ใน .gitignore!
```bash
echo ".env" >> .gitignore
git status  # .env ต้องไม่ปรากฏ
```
:::


## ขั้นตอนที่ 4 — สร้าง docker-compose.override.yml สำหรับ Dev

`override` file จะ merge เข้ากับ `docker-compose.yml` อัตโนมัติเมื่อรัน `docker compose up` บน local

```yaml
# docker-compose.override.yml  (สำหรับ development เท่านั้น)
services:
  api:
    build:
      target: builder           # ใช้ builder stage (มี devDependencies)
    volumes:
      - ./src:/app/src          # mount source code → hot reload
    environment:
      - NODE_ENV=development
    command: ["npx", "ts-node", "src/index.ts"]   # รัน ts-node แทน node dist/

  db:
    ports:
      - "5432:5432"             # expose port สำหรับ DB client tools
```

::: info วิธีทำงาน override
```bash
# local: อ่านทั้งสองไฟล์ merge กัน
docker compose up -d         # = docker-compose.yml + override.yml

# production: ระบุไฟล์เดียว (ไม่เอา override)
docker compose -f docker-compose.yml up -d
```
:::


## ขั้นตอนที่ 5 — ทดสอบ healthcheck & depends_on

### รัน services

```bash
docker compose up -d --build

# ดูสถานะทุก service
docker compose ps
```

รอจนได้ผลลัพธ์:

```
NAME                STATUS                  PORTS
task-tracker-db     Up 45 seconds (healthy) 5432/tcp
task-tracker-api    Up 30 seconds (healthy) 0.0.0.0:3000->3000/tcp
```

### ทดสอบ depends_on ทำงาน

```bash
# หยุด db → api ต้อง restart หรือ unhealthy
docker compose stop db

# ดูสถานะ
docker compose ps
# task-tracker-api  Up 2 minutes (unhealthy)   ← เพราะ db ไม่ได้

# เริ่ม db ใหม่ → api ควรกลับมา healthy
docker compose start db
watch docker compose ps   # กด Ctrl+C เมื่อเสร็จ
```

### ทดสอบ health endpoint

```bash
# ทดสอบ api health
curl http://localhost:3000/health
# {"status":"ok","uptime":120.5,"timestamp":"..."}

# ดู health check logs
docker inspect task-tracker-api | grep -A 20 '"Health"'
```


## ขั้นตอนที่ 6 — ตรวจสอบ Logs และ Debug

```bash
# ดู logs ทุก service
docker compose logs -f

# ดูเฉพาะ api
docker compose logs -f api

# ดู event log ของ Docker
docker events --filter container=task-tracker-api

# Resource usage
docker stats task-tracker-api task-tracker-db
```


## ขั้นตอนที่ 7 — Compose Commands ที่สำคัญ

```bash
# รีสตาร์ท service เดี่ยว โดยไม่หยุด service อื่น
docker compose restart api

# Scale service (ทดลองรัน 2 instance)
docker compose up -d --scale api=2

# รัน one-time command ใน service
docker compose run --rm api node -e "console.log('hello from container')"

# ดูข้อมูล environment ภายใน container
docker compose exec api env | sort

# Cleanup ทั้งหมด
docker compose down -v --remove-orphans
```


## ✅ เกณฑ์การส่งงาน Lab 2

| รายการ | คะแนน |
| :--- | :---: |
| `docker compose ps` แสดง `(healthy)` ครบทุก service | 2 |
| `depends_on: condition: service_healthy` ใน api service | 1 |
| `docker-compose.override.yml` สำหรับ dev mode พร้อม volume mount | 1 |
| ทดสอบ: หยุด db แล้ว api เป็น unhealthy → เริ่ม db ใหม่ api กลับ healthy | 1 |
| **รวม** | **5** |

**ส่ง:**
1. Screenshot `docker compose ps` ที่แสดง `(healthy)` ทุก service
2. Screenshot logs เมื่อหยุด db แล้ว api เปลี่ยน status
3. ไฟล์ `docker-compose.yml` และ `docker-compose.override.yml` ใน GitHub repo


**← ก่อนหน้า:** [Lab 1: Containerize](/wk4/wk4-lab1-containerize)  
**Module ถัดไป →** [Module 5: Midterm Project](/wk5/wk5-midterm-exam)
