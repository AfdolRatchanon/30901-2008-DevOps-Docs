# Final Exam — Task Tracker: Full DevOps Pipeline <Badge type="danger" text="Module 9 · สัปดาห์ 17–18" />

> **คะแนน:** 20 คะแนน (สอบปฏิบัติ) | **รูปแบบ:** GitHub Repository Link + นำเสนอ 10 นาที


## 🎯 โจทย์ Final Exam

ส่ง **Task Tracker ที่มี Full DevOps Pipeline ครบสมบูรณ์** — มากกว่า Midterm คือ pipeline รัน test + deploy ถึง production อัตโนมัติ พร้อม monitoring

> Final เป็นการสะสมผลงานตั้งแต่ wk1 ถึง wk8 ทั้งหมด — ไม่ใช่งานที่ทำในคืนเดียว


## 📦 Milestone ที่ต้องครบ

::: tip Final = Midterm + CI/CD + Testing + Production
| Milestone | ต้องมี |
| :--- | :--- |
| **M1** (wk1) | README.md + folder structure + .gitignore |
| **M2** (wk2) | Shell script `setup.sh` |
| **M3** (wk3) | Git history ≥ 10 commits, Conventional Commits, Husky, Branch Protection |
| **M4** (wk4) | Dockerfile Multi-stage + docker-compose.yml healthy + image บน GHCR |
| **M5** (wk6) | `.github/workflows/ci.yml` + `.github/workflows/cd.yml` |
| **M6** (wk7) | Jest + Supertest tests ≥ 5 cases + ESLint + coverage ≥ 60% |
| **M7** (wk8) | Deploy บน Render (public URL) + `/health` endpoint + UptimeRobot |
:::


## ✅ Checklist ก่อนส่ง (ตรวจทีละข้อ)

### 🖥️ App ทำงานได้

- [ ] `docker compose up -d --build` รัน app ที่ `http://localhost:3000`
- [ ] `docker compose ps` แสดง `(healthy)` ทุก service
- [ ] `GET /api/tasks` คืน JSON array พร้อม status 200
- [ ] `POST /api/tasks` สร้าง task ใหม่ได้ → คืน status 201
- [ ] `PUT /api/tasks/:id` แก้ไข task ได้ → คืน status 200
- [ ] `DELETE /api/tasks/:id` ลบ task ได้ → คืน status 204
- [ ] `GET /health` คืน `{"status":"ok","uptime":..., "version":...}`

### 🔄 CI/CD Pipeline

- [ ] `.github/workflows/ci.yml` รัน lint + build + test ทุก push
- [ ] `.github/workflows/cd.yml` build image → push GHCR → deploy to Render เมื่อ push to main
- [ ] GitHub Secrets ใช้สำหรับทุก sensitive value (`RENDER_DEPLOY_HOOK` etc.)
- [ ] README badge CI/CD แสดงสถานะ pipeline

### 🧪 Testing & Quality

- [ ] Integration test ≥ 5 test cases (Jest + Supertest)
- [ ] `npm run test:coverage` ผ่าน threshold 60%
- [ ] `npm run lint` pass ไม่มี error
- [ ] Coverage report upload เป็น Artifact ใน CI

### 🌍 Production Deployment

- [ ] App deploy บน Render — เปิดได้จาก public URL
- [ ] Environment variables ตั้งบน Render dashboard ไม่ใช่ใน code
- [ ] `.env` อยู่ใน `.gitignore` — ไม่ถูก commit
- [ ] Image บน GHCR public และดึงได้

### 📡 Monitoring

- [ ] UptimeRobot monitor ตั้งค่าและแสดง "Up"
- [ ] UptimeRobot ตั้ง email alert
- [ ] Structured logging ด้วย Pino (log ไป stdout)
- [ ] มี `docs/runbooks/` อย่างน้อย 1 ไฟล์

### 📝 Git & Documentation

- [ ] Git commit history ≥ 15 commits ที่มีความหมาย
- [ ] ทุก commit ใช้ Conventional Commits format
- [ ] Husky + lint-staged ทำงานได้
- [ ] มี อย่างน้อย 2 PR ที่ถูก merge
- [ ] `README.md` ครบ: Quick Start, Docker, API Reference, env vars, badges
- [ ] `.env.example` มีให้เป็น template


## 📊 เกณฑ์การให้คะแนน (20 คะแนน)

| หมวด | รายละเอียด | คะแนน |
| :--- | :--- | :---: |
| **App & Docker** | CRUD ครบ + `docker compose up` healthy | 4 |
| **CI/CD Pipeline** | ci.yml + cd.yml ครบทุก stage รัน pass | 6 |
| **Testing** | ≥ 5 test cases + coverage ≥ 60% + ESLint pass | 4 |
| **Production** | Public URL ทำงาน + UptimeRobot Up + monitoring | 3 |
| **Documentation** | README ครบ + Runbook + commit history | 3 |
| | **รวม** | **20** |


## 📁 โครงสร้าง Repository ที่คาดหวัง

```
task-tracker/
├── .github/
│   ├── workflows/
│   │   ├── ci.yml              ← Lint + Test + Coverage
│   │   └── cd.yml              ← Build Image + Push GHCR + Deploy Render
│   ├── CODEOWNERS
│   ├── pull_request_template.md
│   └── dependabot.yml
├── .husky/
│   ├── pre-commit              ← lint-staged
│   └── commit-msg              ← commitlint
├── docs/
│   ├── adr/
│   │   └── 001-express-over-fastify.md
│   └── runbooks/
│       ├── api-down.md
│       └── deploy-rollback.md
├── src/
│   ├── app.ts                  ← Express app (export สำหรับ test)
│   ├── index.ts                ← Entry point (server.listen)
│   ├── logger.ts               ← Pino logger
│   └── routes/
│       └── tasks.ts
├── tests/
│   ├── tasks.test.ts           ← Integration tests
│   └── health.test.ts
├── Dockerfile                  ← Multi-stage + non-root + HEALTHCHECK
├── docker-compose.yml          ← healthcheck + depends_on
├── docker-compose.override.yml ← dev mode
├── .dockerignore
├── .env.example                ← template สำหรับทีม
├── .gitignore                  ← มี .env และ dist/
├── .eslintrc.json
├── .prettierrc
├── commitlint.config.js
├── jest.config.js
├── package.json
├── tsconfig.json
├── CHANGELOG.md
└── README.md                   ← สำคัญมาก + badges
```


## 🎤 แนวทางการนำเสนอ (10 นาที)

### ส่วนที่ 1: Demo (3 นาที)

```
1. เปิด browser → URL production บน Render
2. แสดงว่า GET /health ทำงาน
3. แสดง CRUD ผ่าน curl หรือ Postman
4. แสดง UptimeRobot dashboard ว่าเป็น "Up"
```

### ส่วนที่ 2: Pipeline Walkthrough (4 นาที)

```
1. เปิด GitHub Actions → แสดง CI run ล่าสุด
2. อธิบายทีละ job: Lint → Build → Test → Push GHCR → Deploy
3. แสดง GHCR package ที่มี image
4. แสดง Render Logs ขณะ running
```

### ส่วนที่ 3: Code Review ตอบคำถาม (3 นาที)

ตัวอย่างคำถามที่ครูอาจถาม:

> - "ทำไมถึงใช้ multi-stage Dockerfile?"
> - "healthcheck ใน docker-compose ทำงานอย่างไร?"
> - "ถ้า test fail CI จะทำอะไร?"
> - "secret เก็บที่ไหน ทำไมไม่ใส่ใน code?"
> - "ถ้า deploy แล้วพัง จะ rollback ยังไง?"

::: tip เตรียมตอบ "ทำไม" ไม่ใช่แค่ "อะไร"
ครูไม่ได้ถามว่า "Docker คืออะไร" แต่ถามว่า "ทำไมถึงใช้ Docker ในโปรเจกต์นี้"
:::


## 🚫 สิ่งที่ทำให้หักคะแนน

::: warning
| สิ่งที่ทำ | ผลที่ตามมา |
| :--- | :--- |
| `.env` หรือ secret ใน GitHub repo | หักคะแนน Production ทั้งหมด |
| `node_modules/` ถูก commit | หักคะแนน Docker |
| app เปิดไม่ได้ที่ public URL | หักคะแนน App & Production |
| CI pipeline แดงตลอด | หักคะแนน CI/CD |
| ตอบ Code Review ไม่ได้ | หักคะแนน Documentation |
:::


## 📤 วิธีส่งงาน

1. Push ทุกอย่างขึ้น GitHub
2. ตรวจ Checklist ทุกข้อ ☑️
3. ส่งใน LMS:
   - **GitHub Repository URL**
   - **Production URL** (บน Render)
   - **GHCR Package URL**
4. ส่งก่อนวันสอบปฏิบัติ


**← ก่อนหน้า:** [DevOps Next Steps](/wk9/wk9-content1-devops-next)
