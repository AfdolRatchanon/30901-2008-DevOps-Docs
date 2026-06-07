# Lab 1: Build CI/CD Pipeline <Badge type="tip" text="Module 6 · Lab 1" />

> **เป้าหมาย:** `git push` แล้วเห็น ✅ green checkmark ใน GitHub Actions และ image ถูก push ขึ้น GHCR อัตโนมัติ

::: info 📌 ต่อจาก Midterm
Lab นี้ใช้ **repo เดียวกับที่ส่ง Midterm** (task-tracker) — ไม่ต้องสร้างใหม่

ก่อนเริ่ม ตรวจสอบสักครู่:
```bash
cd task-tracker       # เข้า folder โปรเจกต์เดิม
git log --oneline -5  # ควรเห็น commit history จาก wk1-wk4
docker compose up -d  # ควรรันได้ที่ localhost:3000
```
ถ้า `docker compose up` ทำงานได้ → พร้อมทำ Lab นี้เลยครับ
:::


## 📋 สิ่งที่ต้องทำ

1. สร้าง `.github/workflows/ci.yml` — CI: lint + build + test
2. สร้าง `.github/workflows/cd.yml` — CD: build image + push to GHCR
3. ตั้งค่า GitHub Secrets
4. ทดสอบโดย push code แล้วดู Actions run


## ขั้นตอนที่ 1 — เตรียม Scripts ใน package.json

ตรวจสอบให้ `package.json` มี scripts ครบ:

```json
{
  "scripts": {
    "dev": "ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "test": "jest --passWithNoTests",
    "test:coverage": "jest --coverage --passWithNoTests"
  }
}
```

ถ้ายังไม่มี ESLint ติดตั้ง:

```bash
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

cat > .eslintrc.json << 'EOF'
{
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint"],
  "extends": ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  "rules": {
    "no-console": "warn"
  }
}
EOF
```

ถ้ายังไม่มี Jest ติดตั้ง:

```bash
npm install --save-dev jest @types/jest ts-jest

cat > jest.config.js << 'EOF'
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
}
EOF
```

ทดสอบ local ก่อน:

```bash
npm run lint
npm run build
npm test
```


## ขั้นตอนที่ 2 — สร้าง CI Workflow

```bash
mkdir -p .github/workflows
touch .github/workflows/ci.yml
```

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: ['**']              # ทุก branch
  pull_request:
    branches: [main]

jobs:
  ci:
    name: Lint → Build → Test
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build TypeScript
        run: npm run build

      - name: Run tests
        run: npm run test:coverage

      - name: Upload coverage report
        uses: actions/upload-artifact@v4
        if: always()                        # upload แม้ test fail
        with:
          name: coverage-report
          path: coverage/
          retention-days: 7
```


## ขั้นตอนที่ 3 — สร้าง CD Workflow (Build + Push GHCR)

```yaml
# .github/workflows/cd.yml
name: CD — Build & Push Image

on:
  push:
    branches: [main]              # รันเฉพาะ main

jobs:
  build-push:
    name: Build Docker Image → Push to GHCR
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write             # ต้องมีเพื่อ push ไป GHCR

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Login to GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=sha,prefix=sha-,format=short
            type=raw,value=latest,enable={{is_default_branch}}

      - name: Build and push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Summary
        run: |
          echo "## 🐳 Docker Image Built" >> $GITHUB_STEP_SUMMARY
          echo "**Image:** \`ghcr.io/${{ github.repository }}:latest\`" >> $GITHUB_STEP_SUMMARY
          echo "**Commit:** \`${{ github.sha }}\`" >> $GITHUB_STEP_SUMMARY
          echo "**Tags:** ${{ steps.meta.outputs.tags }}" >> $GITHUB_STEP_SUMMARY
```


## ขั้นตอนที่ 4 — ตั้งค่า GitHub Secrets

ไปที่ repo → **Settings → Secrets and variables → Actions**

สำหรับ wk6 Lab 1 ไม่ต้องตั้ง secret เพิ่ม เพราะใช้ `GITHUB_TOKEN` ที่ auto-generate

แต่เตรียม secrets เหล่านี้ไว้สำหรับ Lab 2:

| Secret Name | ค่า | ใช้ทำอะไร |
| :--- | :--- | :--- |
| `RENDER_DEPLOY_HOOK` | URL จาก Render | trigger deploy |


## ขั้นตอนที่ 5 — ตั้งค่า GHCR Package ให้ Public

หลัง push image ครั้งแรก:

1. ไปที่ GitHub Profile → **Packages**
2. คลิก `task-tracker` package
3. **Package settings → Danger Zone → Change visibility → Public**


## ขั้นตอนที่ 6 — ทดสอบ Push และดู Actions

```bash
# Commit และ Push workflow files
git add .github/
git commit -m "ci: add CI/CD pipeline with GitHub Actions"
git push origin main
```

ไปที่ GitHub repo → แท็บ **Actions** → ดู workflow run

ตรวจสอบ:

```
CI
├── ✅ Lint → Build → Test     (~2 min)
│
CD — Build & Push Image
└── ✅ Build Docker Image → Push to GHCR    (~3 min)
```

ดู image ที่ push:
- GitHub Profile → Packages → task-tracker
- `ghcr.io/USERNAME/task-tracker:latest`


## ขั้นตอนที่ 7 — ทดสอบ CI Block PR เมื่อ Test Fail

```bash
# สร้าง branch ทดสอบ
git switch -c test/force-ci-fail

# แก้โค้ดให้ lint fail (เพิ่ม var ที่ไม่ใช้)
echo "const unused = 'test'" >> src/index.ts

git add . && git commit -m "test: force lint failure to test CI block"
git push origin test/force-ci-fail
```

สร้าง PR → CI ควรแสดง ❌ และ block merge:

```
❌ CI / Lint → Build → Test (failed)
   Merge is blocked — required status check failed
```

ลบการแก้ไขนั้น:

```bash
git revert HEAD
git push origin test/force-ci-fail
# CI จะกลับมา ✅ และ merge ได้
```


## ✅ เกณฑ์การส่งงาน Lab 1

| รายการ | คะแนน |
| :--- | :---: |
| CI workflow รัน lint + build + test ผ่าน ทุก push | 1.5 |
| CD workflow build image + push ไป GHCR อัตโนมัติเมื่อ push to main | 1.5 |
| ทดสอบ: commit ที่ทำให้ lint fail → CI แสดง ❌ | 1 |
| GHCR package มี image และ public accessible | 1 |
| **รวม** | **5** |

**ส่ง:**
1. Link ของ GitHub Actions run ที่ผ่าน (✅)
2. Link ของ GHCR package
3. Screenshot ของ Actions tab แสดง CI ✅ + CD ✅


**← ก่อนหน้า:** [Secrets Management](/wk6/wk6-content4-secrets-management)  
**ถัดไป →** [Lab 2: Multi-Environment Pipeline](/wk6/wk6-lab2-multi-environment)
