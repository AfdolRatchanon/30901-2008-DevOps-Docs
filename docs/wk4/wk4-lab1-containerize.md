# Lab 1: Containerize Task Tracker + Push to GHCR <Badge type="tip" text="Module 4 · Lab 1" />

> **เป้าหมาย:** `docker compose up` แล้ว app ทำงานได้บน `http://localhost:3000` และ image ถูก push ขึ้น GHCR ✅


## 📋 สิ่งที่ต้องทำ

1. เขียน `Dockerfile` แบบ Multi-stage สำหรับ Task Tracker (Node.js + TypeScript)
2. เขียน `.dockerignore`
3. สร้าง `docker-compose.yml` รัน backend
4. ทดสอบ app รัน local ผ่าน Docker
5. Tag และ Push image ขึ้น GHCR


## ขั้นตอนที่ 1 — เตรียม Task Tracker Project

ถ้ายังไม่มีโปรเจกต์ Task Tracker พื้นฐาน:

```bash
cd task-tracker       # เข้า folder โปรเจกต์จาก Lab wk3

# ตรวจสอบ package.json มี scripts ครบ
cat package.json
```

ตรวจสอบ `package.json` ต้องมี:

```json
{
  "name": "task-tracker",
  "version": "1.0.0",
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "express": "^4.18.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "@types/express": "^4.17.0",
    "ts-node": "^10.9.0"
  }
}
```

ถ้า `src/index.ts` ยังไม่มี สร้างพื้นฐาน:

```typescript
// src/index.ts
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

// Health check endpoint
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Tasks endpoint
app.get('/api/tasks', (_req, res) => {
  res.json({
    data: [
      { id: 1, title: 'เรียน Docker', done: false },
      { id: 2, title: 'สร้าง Dockerfile', done: false },
    ],
    total: 2,
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Task Tracker running on port ${PORT}`)
})
```


## ขั้นตอนที่ 2 — เขียน Dockerfile

```bash
touch Dockerfile
```

```dockerfile
# ══ Stage 1: Builder ══════════════════════════════════════════
FROM node:20-alpine AS builder

WORKDIR /app

# copy package files แยกก่อน เพื่อ cache layer
COPY package*.json ./
RUN npm ci

# copy source และ tsconfig
COPY tsconfig.json ./
COPY src/ ./src/

# compile TypeScript
RUN npm run build


# ══ Stage 2: Production ═══════════════════════════════════════
FROM node:20-alpine AS production

# metadata
LABEL org.opencontainers.image.source="https://github.com/YOUR_USERNAME/task-tracker"
LABEL org.opencontainers.image.description="Task Tracker API"

WORKDIR /app

# ติดตั้งเฉพาะ production dependencies
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# copy compiled code จาก stage builder
COPY --from=builder /app/dist ./dist

# เปลี่ยน ownership ให้ user node
RUN chown -R node:node /app

# สลับเป็น non-root user
USER node

EXPOSE 3000

# health check built-in
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

CMD ["node", "dist/index.js"]
```


## ขั้นตอนที่ 3 — เขียน .dockerignore

```bash
cat > .dockerignore << 'EOF'
node_modules/
dist/
.git/
.env
.env.*
*.log
.DS_Store
.vscode/
tests/
*.test.ts
*.spec.ts
README.md
.github/
EOF
```


## ขั้นตอนที่ 4 — สร้าง docker-compose.yml

```bash
cat > docker-compose.yml << 'EOF'
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile
      target: production
    image: task-tracker:latest
    container_name: task-tracker-api
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - PORT=3000
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "-qO-", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 10s
EOF
```


## ขั้นตอนที่ 5 — ทดสอบผ่าน Docker Compose

```bash
# Build และรัน services
docker compose up -d --build

# ดูสถานะ (รอให้ healthy ประมาณ 30 วินาที)
docker compose ps
# NAME               STATUS                  PORTS
# task-tracker-api   Up 30 seconds (healthy) 0.0.0.0:3000->3000/tcp

# ทดสอบ endpoint
curl http://localhost:3000/health
# {"status":"ok","timestamp":"..."}

curl http://localhost:3000/api/tasks
# {"data":[...],"total":2}

# ดู logs
docker compose logs -f api

# ตรวจสอบว่ารันเป็น non-root
docker compose exec api whoami
# node

# หยุดเมื่อทดสอบเสร็จ
docker compose down
```


## ขั้นตอนที่ 6 — Push Image ขึ้น GHCR

```bash
# Login GHCR ด้วย Personal Access Token
# สร้าง token ที่ GitHub → Settings → Developer settings → Personal access tokens
# ✅ ต้องเลือก scope: write:packages, read:packages

export GITHUB_USERNAME="your-github-username"
export GITHUB_TOKEN="ghp_xxxxxxxxxxxxxxxxxxxx"

echo "$GITHUB_TOKEN" | docker login ghcr.io -u "$GITHUB_USERNAME" --password-stdin
# Login Succeeded

# Tag image สำหรับ GHCR
docker tag task-tracker:latest ghcr.io/$GITHUB_USERNAME/task-tracker:latest
docker tag task-tracker:latest ghcr.io/$GITHUB_USERNAME/task-tracker:v1.0.0

# Push ขึ้น GHCR
docker push ghcr.io/$GITHUB_USERNAME/task-tracker:latest
docker push ghcr.io/$GITHUB_USERNAME/task-tracker:v1.0.0
```

ตรวจสอบที่ GitHub:  
ไปที่ GitHub Profile → **Packages** → ควรเห็น `task-tracker` package

ทดสอบ pull จาก GHCR:

```bash
# ลบ local image แล้ว pull จาก GHCR
docker rmi ghcr.io/$GITHUB_USERNAME/task-tracker:latest
docker pull ghcr.io/$GITHUB_USERNAME/task-tracker:latest
docker run -d -p 3000:3000 ghcr.io/$GITHUB_USERNAME/task-tracker:latest
```


## ✅ เกณฑ์การส่งงาน Lab 1

| รายการ | คะแนน |
| :--- | :---: |
| `Dockerfile` แบบ Multi-stage + non-root user + HEALTHCHECK | 1.5 |
| `docker compose up` รัน app ได้ + `(healthy)` ใน `docker compose ps` | 1.5 |
| Image ถูก push ขึ้น GHCR และ pull กลับมาได้ | 1.5 |
| `.dockerignore` ครอบคลุม node_modules, .env, .git | 0.5 |
| **รวม** | **5** |

**ส่ง:**
1. Link ของ GHCR package
2. Screenshot ของ `docker compose ps` แสดง `(healthy)`
3. Screenshot ผลลัพธ์ `curl http://localhost:3000/health`


**← ก่อนหน้า:** [Cloud Fundamentals](/wk4/wk4-content4-cloud-fundamentals)  
**ถัดไป →** [Lab 2: Compose Advanced](/wk4/wk4-lab2-compose-advanced)
