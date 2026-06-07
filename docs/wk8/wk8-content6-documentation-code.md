# Documentation as Code — README, ADR & Runbook <Badge type="info" text="Module 8 · สัปดาห์ 15–16" />

> **Ref Book:** Beyond the 12-Factor App — Factor X: Dev/Prod Parity


## 📝 ทำไม Documentation ถึงสำคัญใน DevOps?

**กฎ:** Engineer ใหม่ต้อง clone repo → ติดตั้ง → รัน app ได้ **ภายใน 15 นาที** โดยอ่านแค่ README

```
ถ้าทำไม่ได้ → README ไม่ดีพอ → ค่า onboarding สูง
ถ้าทำได้ → documentation as code ประสบความสำเร็จ
```

"Documentation ที่อยู่นอก repo มักจะ outdated เสมอ"


## 📄 README.md ที่ดีต้องมีอะไรบ้าง

```markdown
# Task Tracker API

> REST API จัดการ Task สำหรับวิชา DevOps Style Software Development

![CI](badge) ![CD](badge) ![Docker](badge)

## 📋 Table of Contents
- [Prerequisites](#prerequisites)
- [Quick Start](#quick-start)
- [Docker](#docker)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## Prerequisites
- Node.js 20+
- Docker Desktop 4.x+
- Git 2.x+

## Quick Start

```bash
git clone https://github.com/username/task-tracker.git
cd task-tracker
cp .env.example .env
npm install
npm run dev
# App running at http://localhost:3000
```

## Docker

```bash
# รัน full stack
docker compose up -d

# ดูสถานะ
docker compose ps
```

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | ดึง task ทั้งหมด |
| POST | /api/tasks | สร้าง task ใหม่ |
| PUT | /api/tasks/:id | แก้ไข task |
| DELETE | /api/tasks/:id | ลบ task |
| GET | /health | health check |

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| PORT | ❌ | 3000 | port ที่ app รัน |
| NODE_ENV | ❌ | development | environment |
| DATABASE_URL | production only | - | PostgreSQL URL |
| JWT_SECRET | ✅ production | - | JWT signing key |

## Contributing

ดู [CONTRIBUTING.md](./CONTRIBUTING.md) สำหรับแนวทาง PR
```


## 📋 CHANGELOG.md — บันทึกการเปลี่ยนแปลง

```markdown
# Changelog

All notable changes to this project will be documented in this file.
Format based on [Keep a Changelog](https://keepachangelog.com/).

## [Unreleased]

## [1.1.0] - 2025-04-17

### Added
- เพิ่ม GET /api/tasks?status=done filter
- เพิ่ม pagination: ?limit=10&offset=0

### Fixed
- แก้ปัญหา DELETE /tasks/:id คืน 200 แทน 204

### Security
- อัปเดต express 4.18.2 → 4.19.2 (fix CVE-2024-xxx)

## [1.0.0] - 2025-04-01

### Added
- CRUD operations สำหรับ tasks
- Dockerfile + docker-compose.yml
- GitHub Actions CI/CD pipeline
```


## 🏛️ ADR — Architecture Decision Record

**ADR** บันทึก "ทำไมถึงตัดสินใจเลือก tech/approach นี้" — ช่วยให้คนใหม่เข้าใจบริบทโดยไม่ต้องถาม

```
docs/
└── adr/
    ├── 001-use-express-not-fastify.md
    ├── 002-in-memory-storage-for-mvp.md
    └── 003-ghcr-over-dockerhub.md
```

### Template ADR

```markdown
# ADR 001: ใช้ Express แทน Fastify

**Status:** Accepted
**Date:** 2025-03-01
**Deciders:** ทีมนักเรียน + อาจารย์

## Context
ต้องการ web framework สำหรับ Task Tracker API
ตัวเลือก: Express, Fastify, Hono, Koa

## Decision
ใช้ **Express** เพราะ:
- ecosystem ใหญ่ที่สุด ตัวอย่างเยอะ
- นักเรียส่วนใหญ่คุ้นเคยแล้ว
- middleware ครบ ไม่ต้องเขียนเอง

## Consequences
**ดี:**
- Learning curve ต่ำ
- Documentation เยอะ

**แย่:**
- ช้ากว่า Fastify ประมาณ 2x
- อาจต้องเปลี่ยนถ้า performance เป็นปัญหา
```


## 📖 Runbook — อยู่ใน Repo

Runbook ควรอยู่ใน repo เดียวกับ code เพื่อ update พร้อมกัน:

```
docs/
└── runbooks/
    ├── api-down.md          ← ถ้า API ไม่ตอบ
    ├── high-memory.md       ← ถ้า memory สูง
    ├── deploy-rollback.md   ← วิธี rollback
    └── database-backup.md   ← backup/restore
```

Runbook template พื้นฐาน:

```markdown
# Runbook: [ชื่อ Runbook]

**Severity:** P1/P2/P3
**Owner:** @team-name
**Last Updated:** 2025-04-17

## Symptoms
- อาการที่เห็น

## Investigation
1. ตรวจ ... ด้วยคำสั่ง `...`
2. ดู log ที่ ...

## Resolution
1. ถ้าเกิดจาก A → ทำ B
2. ถ้าเกิดจาก C → ทำ D

## Verification
ตรวจสอบว่าแก้แล้วด้วย: `curl .../health`

## Escalation
ถ้าแก้ไม่ได้ใน 30 นาที → แจ้ง @senior
```


## 🔄 Documentation Stay Updated

Documentation อยู่ใน repo → update พร้อม code:

```yaml
# .github/pull_request_template.md
## PR Checklist
- [ ] อัปเดต README ถ้าเพิ่ม API endpoint ใหม่
- [ ] อัปเดต CHANGELOG.md
- [ ] อัปเดต .env.example ถ้าเพิ่ม env var ใหม่
- [ ] เพิ่ม ADR ถ้ามีการตัดสินใจ architecture สำคัญ
```


## 💡 สรุป

::: info Documentation Checklist สำหรับ Task Tracker
| ไฟล์ | ต้องมี |
| :--- | :--- |
| `README.md` | ✅ Quick start, API reference, env vars |
| `.env.example` | ✅ Template ไม่มีค่า secret จริง |
| `CHANGELOG.md` | ✅ บันทึกการเปลี่ยนแปลงทุก release |
| `docs/adr/` | ✅ ADR สำหรับการตัดสินใจสำคัญ |
| `docs/runbooks/` | ✅ คู่มือ on-call |
:::


**← ก่อนหน้า:** [Incident Response](/wk8/wk8-content5-incident-response)  
**ถัดไป →** [Lab 1: Go Production](/wk8/wk8-lab1-production)
