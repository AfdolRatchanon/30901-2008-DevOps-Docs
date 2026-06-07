# Midterm Project — Task Tracker <Badge type="danger" text="Module 5 · สัปดาห์ 9" />

> **คะแนน:** 20 คะแนน | **รูปแบบ:** ส่ง GitHub Repository Link


## 🎯 โจทย์ Midterm

ส่ง **GitHub Repository ของ Task Tracker** ที่สมบูรณ์ — รันได้จริง, Dockerized, Git history สะอาด

> โปรเจกต์นี้เป็นผลงานที่สะสมมาตั้งแต่ wk1 ถึง wk4 — ไม่ใช่งานที่ทำในคืนเดียว


## 📦 สิ่งที่โปรเจกต์ต้องมี (Milestone M1–M4 ครบ)

::: tip Project Milestone Checklist
| Milestone | ต้องมี |
| :--- | :--- |
| **M1** | README.md + folder structure ชัดเจน + .gitignore |
| **M2** | Shell script `setup.sh` ตั้งค่า project อัตโนมัติ |
| **M3** | Git history ≥ 10 commits, Conventional Commits, Husky + Prettier, Branch Protection |
| **M4** | `Dockerfile` (Multi-stage) + `docker-compose.yml` (healthcheck) + push image ขึ้น GHCR |
:::


## ✅ Checklist ก่อนส่ง

### App ทำงานได้

- [ ] `npm run dev` รัน app ได้ที่ `http://localhost:3000`
- [ ] `GET /api/tasks` — ส่งคืน task list (JSON array)
- [ ] `POST /api/tasks` — สร้าง task ใหม่ได้
- [ ] `PUT /api/tasks/:id` — แก้ไข task ได้
- [ ] `DELETE /api/tasks/:id` — ลบ task ได้
- [ ] `GET /health` — ส่งคืน `{"status": "ok"}` พร้อม status 200

### Docker

- [ ] `Dockerfile` Multi-stage build ผ่าน — `docker build` ไม่ error
- [ ] `docker compose up --build` รัน app ได้ที่ `http://localhost:3000`
- [ ] `docker compose ps` แสดง `(healthy)` สำหรับทุก service
- [ ] `.dockerignore` มี `node_modules/`, `.env`, `.git/`
- [ ] image ถูก push ขึ้น GHCR และ public หรือ accessible

### Git & GitHub

- [ ] Commit ≥ 10 commits ที่มีความหมาย
- [ ] Commit message ใช้ Conventional Commits ทุกอัน (`feat:`, `fix:`, `docs:`, `chore:`)
- [ ] Husky + lint-staged ทำงานได้ (เห็น evidence ใน commit)
- [ ] มีอย่างน้อย 1 PR ที่ถูก merge (จาก Lab wk3)
- [ ] Branch Protection เปิดอยู่บน `main`

### README.md

- [ ] อธิบาย project คืออะไร
- [ ] วิธีรัน local (`npm run dev`)
- [ ] วิธีรัน Docker (`docker compose up`)
- [ ] API endpoints พร้อม curl example
- [ ] environment variables ที่ต้องตั้งค่า


## 📊 เกณฑ์การให้คะแนน

| เกณฑ์ | รายละเอียด | คะแนน |
| :--- | :--- | :---: |
| **App ทำงานได้** | CRUD ครบ 4 endpoints + /health | 6 |
| **Docker ทำงานได้** | Dockerfile + Compose + healthy + GHCR | 6 |
| **Git history** | ≥ 10 commits, Conventional format, Husky, มี PR | 4 |
| **README.md** | ครบ, อ่านเข้าใจง่าย, มี curl example | 4 |
| | **รวม** | **20** |


## 📁 โครงสร้าง Repository ที่คาดหวัง

```
task-tracker/
├── .github/
│   └── CODEOWNERS          (optional แต่ดี)
├── .husky/
│   ├── pre-commit
│   └── commit-msg
├── src/
│   ├── index.ts
│   ├── routes/
│   │   └── tasks.ts
│   └── data/
│       └── tasks.ts
├── tests/                   (optional สำหรับ midterm)
├── Dockerfile               ← Multi-stage
├── docker-compose.yml       ← healthcheck + depends_on
├── docker-compose.override.yml  ← dev mode
├── .dockerignore
├── .env.example             ← template (ไม่ commit .env จริง)
├── .gitignore
├── .prettierrc
├── commitlint.config.js
├── package.json
├── tsconfig.json
└── README.md                ← สำคัญมาก
```


## 📝 Template README.md ที่ดี

```markdown
# Task Tracker API

> REST API สำหรับจัดการ Task รายวัน — สร้างด้วย Node.js + TypeScript + Express

![Docker](https://img.shields.io/badge/Docker-ready-blue)

## Quick Start

### Local Development
```bash
npm install
cp .env.example .env
npm run dev
```

### Docker
```bash
cp .env.example .env
docker compose up -d --build
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/tasks | ดึง task ทั้งหมด |
| POST | /api/tasks | สร้าง task ใหม่ |
| PUT | /api/tasks/:id | แก้ไข task |
| DELETE | /api/tasks/:id | ลบ task |
| GET | /health | health check |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3000 | port ที่ app รัน |
| NODE_ENV | development | environment |
```


## 📤 วิธีส่งงาน

1. Commit และ Push ทุกอย่างขึ้น GitHub
2. ตรวจสอบ Checklist ทุกข้อ ☑️
3. ส่ง **GitHub Repository URL** ผ่านช่องทางที่กำหนด
4. ส่งภายในเวลา **ก่อนสอบกลางภาค**

::: warning สิ่งที่ทำให้หักคะแนน
- `.env` หรือ secret อยู่ใน repository → หักคะแนน Docker ทันที
- `node_modules/` ถูก commit → หักคะแนน Git
- Commit message ไม่ใช้ Conventional Commits → หักคะแนน Git
- `docker compose up` แล้ว error → หักคะแนน Docker
:::


**← ก่อนหน้า:** [Lab wk4: Compose Advanced](/wk4/wk4-lab2-compose-advanced)  
**หลังสอบกลางภาค →** [Module 6: CI/CD with GitHub Actions](/wk6/wk6-content1-cicd-basics)
