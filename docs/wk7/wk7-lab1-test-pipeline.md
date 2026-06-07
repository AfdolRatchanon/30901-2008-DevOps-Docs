# Lab: Test in Pipeline — Jest + ESLint + Coverage Gate <Badge type="tip" text="Module 7 · Lab 1" />

> **เป้าหมาย:** pipeline บังคับ code quality ก่อน merge ได้จริง — commit ที่ tests fail → pipeline สีแดง ❌


## 📋 สิ่งที่ต้องทำ

1. เขียน Integration Test ด้วย Jest + Supertest (≥ 5 test cases)
2. ตั้งค่า ESLint พร้อม rules ที่เหมาะสม
3. เพิ่ม Quality Gate ใน `ci.yml` (lint + test + coverage ≥ 60%)
4. ทดสอบว่า pipeline block commit ที่ผิดจริง


## ขั้นตอนที่ 1 — ติดตั้ง Tools

```bash
npm install --save-dev \
  jest \
  @types/jest \
  ts-jest \
  supertest \
  @types/supertest \
  eslint \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin
```


## ขั้นตอนที่ 2 — ตั้งค่า Jest

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',      // ไม่นับ entry point
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  coverageReporters: ['text', 'lcov', 'html'],
}
```

เพิ่ม scripts ใน `package.json`:

```json
{
  "scripts": {
    "test": "jest --passWithNoTests",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix"
  }
}
```


## ขั้นตอนที่ 3 — ตั้งค่า ESLint

```json
// .eslintrc.json
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "eqeqeq": ["error", "always"],
    "no-var": "error",
    "prefer-const": "error"
  },
  "ignorePatterns": ["dist/", "node_modules/", "jest.config.js"]
}
```

ทดสอบ:

```bash
npm run lint
# ถ้ามี error → แก้ก่อน หรือรัน: npm run lint:fix
```


## ขั้นตอนที่ 4 — Refactor โค้ด แล้วเขียน Tests

::: warning ทำไมต้อง Refactor?
ใน wk4 เราใส่ทุกอย่างไว้ใน `src/index.ts` รวมถึง `app.listen()` — ทำให้ Supertest ไม่สามารถ import app มาทดสอบได้โดยตรง (จะเปิด port จริงทุกครั้ง)

**วิธีแก้:** แยก express `app` ออกมาเป็น `src/app.ts` และให้ `src/index.ts` เป็นแค่ entry point ที่เรียก `app.listen()`
:::

### 1. แยก Express app ออกจาก server (สร้างไฟล์ใหม่ `src/app.ts`)

**ให้นักเรียนก๊อปปี้โค้ดด้านล่างนี้ไปวางสร้างเป็นไฟล์ใหม่ชื่อ `src/app.ts` ได้เลยครับ:**

```typescript
// src/app.ts
import express from 'express'
import { taskRouter } from './routes/tasks'

export const app = express()
app.use(express.json())

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

app.use('/tasks', taskRouter)
```

### 2. แก้ไขไฟล์ `src/index.ts` เดิม

**ให้นักเรียนลบโค้ดทั้งหมดในไฟล์ `src/index.ts` เดิมทิ้ง แล้วก๊อปปี้โค้ดสั้นๆ ด้านล่างนี้ไปวางทับทั้งหมดเลยครับ** (ให้เหลือแค่ส่วนที่คอยเรียกใช้งาน `app.listen()`):

```typescript
// src/index.ts
import { app } from './app'

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Task Tracker running on http://localhost:${PORT}`)
})
```

### เขียน Tests

```typescript
// tests/tasks.test.ts
import request from 'supertest'
import { app } from '../src/app'

describe('Task Tracker API', () => {

  describe('GET /health', () => {
    it('returns 200 with status ok', async () => {
      const res = await request(app).get('/health').expect(200)
      expect(res.body.status).toBe('ok')
    })
  })

  describe('GET /tasks', () => {
    it('returns 200 with tasks array', async () => {
      const res = await request(app).get('/tasks').expect(200)
      expect(Array.isArray(res.body)).toBe(true)
    })
  })

  describe('POST /tasks', () => {
    it('creates task → 201', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Test Task' })
        .expect(201)

      expect(res.body.title).toBe('Test Task')
      expect(res.body.done).toBe(false)
      expect(res.body).toHaveProperty('id')
    })

    it('returns 400 when title missing', async () => {
      await request(app).post('/tasks').send({ done: false }).expect(400)
    })
  })

  describe('DELETE /tasks/:id', () => {
    it('deletes task → 200', async () => {
      const createRes = await request(app)
        .post('/tasks')
        .send({ title: 'To delete' })
        .expect(201)

      await request(app)
        .delete(`/tasks/${createRes.body.id}`)
        .expect(200)

      await request(app)
        .get(`/tasks/${createRes.body.id}`)
        .expect(404)
    })

    it('returns 404 for non-existent task', async () => {
      await request(app).delete('/tasks/invalid-id').expect(404)
    })
  })
})
```

รัน test:

```bash
npm run test:coverage
# ต้องได้ coverage ≥ 60% ในทุกหมวด
```


## ขั้นตอนที่ 5 — เพิ่ม Quality Gate ใน CI

```yaml
# .github/workflows/ci.yml  (อัปเดต)
name: CI

on:
  push:
    branches: ['**']
  pull_request:
    branches: [main]

jobs:
  quality:
    name: Lint + Test + Coverage
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci

      - name: ESLint
        run: npm run lint

      - name: Build TypeScript
        run: npm run build

      - name: Tests + Coverage Gate (≥ 60%)
        run: npm run test:coverage

      - name: Upload Coverage Report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-${{ github.sha }}
          path: coverage/lcov-report/
          retention-days: 7
```


## ขั้นตอนที่ 6 — ทดสอบ Pipeline Block

### ทดสอบ: lint fail

```bash
git switch -c test/force-lint-fail
# เพิ่ม unused variable
echo "const x = 1" >> src/app.ts
git add . && git commit -m "test: force lint error"
git push origin test/force-lint-fail
```

→ GitHub Actions ต้องแสดง **❌ ESLint** step fail

### ทดสอบ: test fail

```bash
git switch -c test/force-test-fail
# แก้ test ให้คาดหวังค่าผิด
sed -i 's/status.*ok/status.*WRONG/' tests/tasks.test.ts
git add . && git commit -m "test: force test failure"
git push origin test/force-test-fail
```

→ GitHub Actions ต้องแสดง **❌ Tests + Coverage Gate** fail

### cleanup

```bash
git revert HEAD  # หรือ git reset --hard ก่อนแก้
git push
```


## ✅ เกณฑ์การส่งงาน Lab

| รายการ | คะแนน |
| :--- | :---: |
| Integration Test ≥ 5 cases (happy path + error) | 2 |
| ESLint ตั้งค่าครบและ pass | 1 |
| Coverage ≥ 60% ทุกหมวด | 1 |
| Pipeline block commit ที่ lint/test fail | 1 |
| **รวม** | **5** |

**ส่ง:**
1. Screenshot `npm run test:coverage` แสดง coverage ≥ 60%
2. Screenshot GitHub Actions run สีเขียว ✅
3. Screenshot ทดสอบ pipeline block (❌ run)


**← ก่อนหน้า:** [Performance Testing](/wk7/wk7-content4-performance-testing)  
**Module ถัดไป →** [Module 8: Production & Monitoring](/wk8/wk8-content1-deployment)
