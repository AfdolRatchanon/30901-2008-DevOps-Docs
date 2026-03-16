# Task Tracker

> โปรเจกต์หลักวิชา 30901-2008 DevOps Style Software Development

## Prerequisites

- Node.js 20 LTS
- Docker Desktop
- Git

## Quick Start (local)

```bash
npm install
npm run dev
# เปิด http://localhost:3000
```

## Quick Start (Docker)

```bash
docker compose up --build
# เปิด http://localhost:3000
```

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /tasks | ดู task ทั้งหมด |
| GET | /tasks/:id | ดู task เดียว |
| POST | /tasks | สร้าง task ใหม่ |
| PUT | /tasks/:id | อัปเดต task |
| DELETE | /tasks/:id | ลบ task |
| GET | /health | Health check |

## Environment Variables

| ตัวแปร | ค่าเริ่มต้น | คำอธิบาย |
|---|---|---|
| PORT | 3000 | Port ที่ server รัน |

## Project Milestone

- [ ] M1: Repo + README + folder structure
- [ ] M2: Shell script setup
- [ ] M3: Branch history + PR + Husky
- [ ] M4: Dockerfile + docker-compose
- [ ] M6: CI/CD pipeline
- [ ] M7: Tests + quality gate
- [ ] M8: Live URL + monitoring
