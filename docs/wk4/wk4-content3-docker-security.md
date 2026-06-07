# Docker Security — Best Practices <Badge type="info" text="Module 4 · สัปดาห์ 7–8" />

> **Ref Book:** Docker Deep Dive 2025 — Chapter 16


## 🔐 ทำไม Security ต้องคิดตั้งแต่ Dockerfile?

Container อาจดูปลอดภัยเพราะแยก process — แต่ถ้าตั้งค่าผิด ความเสี่ยงยังมีอยู่:

| ความเสี่ยง | ตัวอย่าง |
| :--- | :--- |
| รันเป็น root | ถ้า container ถูก exploit → attacker ได้ root บน host |
| Secret ใน image | `ENV DB_PASSWORD=1234` → ใครดู image history ก็เห็น |
| Base image เก่า | มี CVE ที่ยังไม่ได้ patch |
| node_modules มี vulnerability | dependency ที่ malicious |

> เรียน **3 best practice** — ทำได้ทันทีในทุกโปรเจกต์


## 🧑‍💻 Best Practice 1: Non-root User

โดย default Container รันเป็น **root** — อันตรายมากถ้าถูก exploit

```dockerfile
# ❌ แบบไม่ปลอดภัย (default = root)
FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm ci
CMD ["node", "dist/index.js"]
# รันเป็น root → ถ้า exploit ได้ = root บน container

# ✅ แบบปลอดภัย
FROM node:20-alpine

WORKDIR /app

# สร้าง non-root user (node image มี user "node" ให้พร้อม)
RUN mkdir -p /app && chown -R node:node /app

COPY --chown=node:node package*.json ./
RUN npm ci --omit=dev

COPY --chown=node:node . .

# สลับเป็น non-root user ก่อน CMD
USER node

CMD ["node", "dist/index.js"]
```

ตรวจสอบว่ารันเป็น user อะไร:

```bash
docker exec task-tracker whoami
# node  ← ✅ ไม่ใช่ root
```

::: tip node:20-alpine มี user "node" พร้อมแล้ว
Image official ของ Node.js สร้าง user `node` ไว้ให้ UID=1000 — ใช้ได้เลยไม่ต้องสร้างใหม่
:::


## 📁 Best Practice 2: .dockerignore ที่ครอบคลุม

`.dockerignore` ป้องกันไม่ให้ไฟล์ที่ไม่ควรเข้าไปอยู่ใน image เลย

```bash
# .dockerignore ที่สมบูรณ์สำหรับ Node.js project

# Dependencies (ติดตั้งใหม่ใน container ดีกว่า)
node_modules/

# Environment & Secrets (ห้ามเข้า image เด็ดขาด!)
.env
.env.*
*.pem
*.key

# Git
.git/
.gitignore

# Build output เดิม
dist/
build/

# Dev tools
.vscode/
.idea/
*.log

# OS files
.DS_Store
Thumbs.db

# Test & CI (ไม่จำเป็นใน production image)
tests/
__tests__/
*.test.ts
*.spec.ts
.github/
```

ทดสอบว่า `.dockerignore` ทำงาน:

```bash
# Build แล้วดูขนาด — ถ้ามี node_modules หลุดเข้าไปจะใหญ่มาก
docker build -t test-image .
docker images test-image
# REPOSITORY    TAG     IMAGE ID    CREATED    SIZE
# test-image    latest  abc123      1 min ago  178MB  ← ✅ เล็ก
```


## 🔒 Best Practice 3: Secrets จัดการแยก จาก Image

**กฎเหล็ก: ห้ามใส่ Secret ใน Dockerfile หรือ docker-compose.yml โดยตรงเด็ดขาด**

```dockerfile
# ❌ อันตราย — secret อยู่ใน image layer ตลอดไป
ENV DB_PASSWORD=supersecret123
ENV JWT_SECRET=my-jwt-secret

# ใครรัน: docker history my-image จะเห็น!
```

```bash
# ✅ ถูกต้อง — ส่งผ่าน environment variable ตอน run
docker run -d \
  -e DB_PASSWORD="$DB_PASSWORD" \
  -e JWT_SECRET="$JWT_SECRET" \
  task-tracker:latest

# หรือใช้ --env-file (อ่านจาก .env บน host แต่ไม่ copy เข้า image)
docker run -d --env-file .env task-tracker:latest
```

```yaml
# ✅ ใน docker-compose.yml — อ่านจาก .env บน host
services:
  api:
    env_file:
      - .env          # .env อยู่บน host ไม่ได้อยู่ใน image
    environment:
      - NODE_ENV=production   # ค่าที่ปลอดภัยใส่ตรงนี้ได้
```

::: warning .env ต้องอยู่ใน .gitignore และ .dockerignore เสมอ
```bash
# ตรวจสอบว่า .env ไม่ได้ถูก track ใน git
git status
# ไม่ควรเห็น .env ใน untracked files หรือ staged files
```
:::


## 🏔️ Minimal Base Image — node:20-alpine

ขนาด image ส่งผลต่อความเร็ว pull, attack surface และ storage

```bash
# เปรียบเทียบขนาด base images
docker pull node:20          && docker images node:20
docker pull node:20-slim     && docker images node:20-slim
docker pull node:20-alpine   && docker images node:20-alpine

# REPOSITORY  TAG          SIZE
# node        20           1.1 GB    ← ใหญ่มาก มี tools เยอะ
# node        20-slim      235 MB    ← Debian ตัดของออกบ้าง
# node        20-alpine    181 MB    ← เล็กที่สุด Alpine Linux
```

::: tip ใช้ node:20-alpine เสมอในวิชานี้
Alpine Linux มีขนาดเล็กและมี attack surface น้อยกว่า Debian based images อย่างมาก
:::


## 🔍 npm audit — ตรวจ Vulnerability ใน Dependencies

```bash
# ตรวจสอบ dependency vulnerabilities
npm audit

# ตัวอย่าง output
# found 3 vulnerabilities (1 moderate, 2 high)
# Run `npm audit fix` to fix them

# แก้อัตโนมัติ
npm audit fix

# แก้รวม breaking changes
npm audit fix --force

# ใน CI — fail pipeline ถ้ามี high/critical
npm audit --audit-level high
```


## 🛡️ Docker Scout — Scan Image หา CVE

Docker Desktop มี **Docker Scout** built-in:

```bash
# scan image หา vulnerability
docker scout cves task-tracker:latest

# ตัวอย่าง output
# ✓ SBOM of image already cached
# ✗ Detected 2 vulnerable packages
#   CVE-2023-xxxx HIGH openssl 3.0.2
#   CVE-2023-yyyy MEDIUM curl 7.88.1

# แนะนำ base image ที่ปลอดภัยกว่า
docker scout recommendations task-tracker:latest
```


## ✅ Checklist Dockerfile ปลอดภัย

```dockerfile
# ✅ ใช้ alpine base image
FROM node:20-alpine

# ✅ ระบุ version ชัดเจน ไม่ใช้ :latest เพราะเปลี่ยนได้
# FROM node:20.11.0-alpine3.19

WORKDIR /app

# ✅ copy package ก่อน เพื่อ cache layer
COPY package*.json ./

# ✅ omit dev dependencies ใน production
RUN npm ci --omit=dev

# ✅ เปลี่ยน ownership ไฟล์ก่อน switch user
COPY --chown=node:node . .

# ✅ switch เป็น non-root user ก่อน CMD
USER node

EXPOSE 3000

# ✅ ใช้ exec form (array) ไม่ใช่ shell form
CMD ["node", "dist/index.js"]
```


## 💡 สรุป

::: info 3 Best Practice ต้องทำทุกโปรเจกต์
| Practice | วิธีทำ | ผลลัพธ์ |
| :--- | :--- | :--- |
| **Non-root user** | `USER node` ใน Dockerfile | ลด risk ถ้าถูก exploit |
| **.dockerignore** | exclude `.env`, `node_modules`, `.git` | image เล็ก + secret ปลอดภัย |
| **Secret management** | `--env-file .env` ไม่ใช้ `ENV` ใน Dockerfile | secret ไม่อยู่ใน image |
| **Alpine image** | `FROM node:20-alpine` | image เล็ก, attack surface น้อย |
| **npm audit** | รันใน CI ทุก build | จับ vulnerability ก่อน production |
:::


**← ก่อนหน้า:** [Dockerfile & Docker Compose](/wk4/wk4-content2-dockerfile-compose)  
**ถัดไป →** [Cloud Fundamentals](/wk4/wk4-content4-cloud-fundamentals)
