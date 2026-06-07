# SIT / Integration Testing — Supertest <Badge type="info" text="Module 7 · สัปดาห์ 13–14" />

> **Ref Book:** Alice and Bob Learn Application Security — Chapter 3


## 🔗 Integration Testing vs Unit Testing

| | Unit Test | Integration Test (SIT) |
| :--- | :--- | :--- |
| **ทดสอบอะไร** | Function เดี่ยว | HTTP route → controller → data ทั้งหมด |
| **Network/DB** | ❌ Mock ทั้งหมด | ✅ ส่ง HTTP จริง (ไม่ต้อง DB จริง) |
| **ความเร็ว** | < 1ms | 10–100ms |
| **เมื่อ fail** | รู้ว่า function ไหนพัง | รู้ว่า flow ไหนพัง |
| **เครื่องมือ** | Jest | Jest + **Supertest** |


## 📦 ติดตั้ง Supertest

```bash
npm install --save-dev supertest @types/supertest
```

### แยก app ออกจาก server เพื่อทดสอบ

```typescript
// src/app.ts — Express app (ไม่มี listen)
import express from 'express'
import { taskRouter } from './routes/tasks'

export const app = express()
app.use(express.json())
app.use('/api/tasks', taskRouter)
app.get('/health', (_req, res) => res.json({ status: 'ok' }))

// src/index.ts — Entry point (รัน server)
import { app } from './app'
const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`🚀 Running on port ${PORT}`))
```

::: tip ทำไมต้องแยก app.ts กับ index.ts?
Supertest import `app` โดยตรงโดยไม่ต้อง `listen` — ถ้ารวมไว้ในไฟล์เดียว server จะ start ทุกครั้งที่รัน test
:::


## 🧪 เขียน Integration Test ครบทุก Endpoint

### โครงสร้างไฟล์

```
tests/
├── tasks.test.ts        ← Integration tests สำหรับ /api/tasks
└── health.test.ts       ← Health check test
```

### Task Router Tests

```typescript
// tests/tasks.test.ts
import request from 'supertest'
import { app } from '../src/app'

describe('Task API', () => {

  // ─── GET /api/tasks ────────────────────────────────────────
  describe('GET /api/tasks', () => {
    it('should return 200 with array of tasks', async () => {
      const res = await request(app)
        .get('/api/tasks')
        .expect(200)
        .expect('Content-Type', /json/)

      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body).toHaveProperty('total')
    })
  })

  // ─── POST /api/tasks ───────────────────────────────────────
  describe('POST /api/tasks', () => {
    it('should create a new task and return 201', async () => {
      const newTask = { title: 'เรียน Supertest', done: false }

      const res = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Content-Type', 'application/json')
        .expect(201)

      expect(res.body).toMatchObject({
        title: 'เรียน Supertest',
        done: false,
      })
      expect(res.body).toHaveProperty('id')
    })

    it('should return 400 when title is missing', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ done: false })           // ไม่มี title
        .expect(400)
    })

    it('should return 400 when title is empty string', async () => {
      await request(app)
        .post('/api/tasks')
        .send({ title: '', done: false })
        .expect(400)
    })
  })

  // ─── GET /api/tasks/:id ────────────────────────────────────
  describe('GET /api/tasks/:id', () => {
    it('should return task by id', async () => {
      // สร้าง task ก่อน
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to get', done: false })
        .expect(201)

      const taskId = createRes.body.id

      const res = await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(200)

      expect(res.body.id).toBe(taskId)
    })

    it('should return 404 when task not found', async () => {
      await request(app)
        .get('/api/tasks/99999')
        .expect(404)
    })
  })

  // ─── PUT /api/tasks/:id ────────────────────────────────────
  describe('PUT /api/tasks/:id', () => {
    it('should update task and return updated data', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Original Title', done: false })
        .expect(201)

      const taskId = createRes.body.id

      const res = await request(app)
        .put(`/api/tasks/${taskId}`)
        .send({ title: 'Updated Title', done: true })
        .expect(200)

      expect(res.body.title).toBe('Updated Title')
      expect(res.body.done).toBe(true)
    })

    it('should return 404 when updating non-existent task', async () => {
      await request(app)
        .put('/api/tasks/99999')
        .send({ title: 'test', done: false })
        .expect(404)
    })
  })

  // ─── DELETE /api/tasks/:id ─────────────────────────────────
  describe('DELETE /api/tasks/:id', () => {
    it('should delete task and return 204', async () => {
      const createRes = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task to delete', done: false })
        .expect(201)

      const taskId = createRes.body.id

      await request(app)
        .delete(`/api/tasks/${taskId}`)
        .expect(204)

      // ตรวจว่าถูกลบจริง
      await request(app)
        .get(`/api/tasks/${taskId}`)
        .expect(404)
    })

    it('should return 404 when deleting non-existent task', async () => {
      await request(app)
        .delete('/api/tasks/99999')
        .expect(404)
    })
  })
})
```

### Health Check Test

```typescript
// tests/health.test.ts
import request from 'supertest'
import { app } from '../src/app'

describe('Health Check', () => {
  it('GET /health should return 200 with status ok', async () => {
    const res = await request(app)
      .get('/health')
      .expect(200)
      .expect('Content-Type', /json/)

    expect(res.body.status).toBe('ok')
  })
})
```


## ⚙️ ตั้งค่า Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
}
```

```json
// package.json scripts
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  }
}
```


## 🏃 รัน Test และดู Coverage

```bash
# รัน tests ทั้งหมด
npm test

# ตัวอย่าง output ที่ดี
# PASS  tests/tasks.test.ts
#   Task API
#     GET /api/tasks
#       ✓ should return 200 with array of tasks (45ms)
#     POST /api/tasks
#       ✓ should create a new task and return 201 (12ms)
#       ✓ should return 400 when title is missing (8ms)
#     ...
# Test Suites: 2 passed, 2 total
# Tests:       10 passed, 10 total

# รัน พร้อม coverage report
npm run test:coverage

# Coverage summary
# Statements   : 87.5% (42/48)
# Branches     : 75%   (12/16)
# Functions    : 90%   (9/10)
# Lines        : 88%   (40/45)
```


## 🚦 เพิ่ม Integration Test ใน CI Pipeline

```yaml
# .github/workflows/ci.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci

      - name: Unit + Integration Tests with Coverage
        run: npm run test:coverage

      - name: Upload coverage to Artifacts
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report-${{ github.sha }}
          path: coverage/lcov-report/
          retention-days: 14

      - name: Coverage summary in PR
        uses: romeovs/lcov-reporter-action@v0.3.1
        if: github.event_name == 'pull_request'
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
```


## 💡 สรุป

::: info Test ที่ต้องเขียนสำหรับ Task Tracker API
| Endpoint | Happy Path | Error Case |
| :--- | :---: | :---: |
| GET /api/tasks | ✅ 200 + array | — |
| POST /api/tasks | ✅ 201 + new task | ✅ 400 (no title) |
| GET /api/tasks/:id | ✅ 200 + task | ✅ 404 (not found) |
| PUT /api/tasks/:id | ✅ 200 + updated | ✅ 404 (not found) |
| DELETE /api/tasks/:id | ✅ 204 | ✅ 404 (not found) |
| GET /health | ✅ 200 status: ok | — |
:::


**← ก่อนหน้า:** [Security & Code Quality](/wk7/wk7-content2-security-quality)  
**ถัดไป →** [Performance Testing with k6](/wk7/wk7-content4-performance-testing)
