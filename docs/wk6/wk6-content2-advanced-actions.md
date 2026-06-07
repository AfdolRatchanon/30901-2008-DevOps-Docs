# Advanced GitHub Actions — Matrix, Cache & Environments <Badge type="info" text="Module 6 · สัปดาห์ 10–12" />

> **Ref Book:** Learning GitHub Actions — Chapter 5–9


## 🗄️ Caching — เร่ง Build ให้เร็วขึ้น

ทุกครั้งที่ workflow รัน — `npm ci` ต้องดาวน์โหลด dependencies ใหม่ทั้งหมด  
Cache ช่วยให้ข้ามขั้นตอนนี้เมื่อ `package-lock.json` ไม่เปลี่ยน

```yaml
steps:
  - uses: actions/checkout@v4

  - uses: actions/setup-node@v4
    with:
      node-version: '20'
      cache: 'npm'            # ← วิธีง่ายที่สุด: cache อัตโนมัติ

  - run: npm ci               # ถ้า cache hit → เร็วขึ้น ~60 วินาที
```

```yaml
# หรือ cache แบบ manual
  - name: Cache node_modules
    uses: actions/cache@v4
    with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
        ${{ runner.os }}-node-
```

::: tip ผลลัพธ์ของ Cache
| | ไม่มี cache | มี cache (hit) |
| :--- | :---: | :---: |
| npm install time | ~90 วินาที | ~5 วินาที |
| Total CI time | ~4 นาที | ~2.5 นาที |
:::


## 📦 Artifacts — เก็บ Output ของ Job

Artifact คือไฟล์ที่ workflow สร้างขึ้น — เก็บไว้ดาวน์โหลดได้หลัง run เสร็จ

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: dist-files                  # ชื่อ artifact
          path: dist/                       # folder ที่จะเก็บ
          retention-days: 7                 # เก็บกี่วัน

  deploy:
    needs: build                            # รอ build job เสร็จก่อน
    runs-on: ubuntu-latest
    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: dist-files
          path: dist/

      - run: ls dist/                       # ใช้งาน artifact ที่ดาวน์โหลดมา
```


## 🔢 Matrix Strategy — Test หลาย Version พร้อมกัน

Matrix ให้รัน Job เดียวกันกับ input หลายแบบแบบ parallel

```yaml
jobs:
  test:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        node-version: [18, 20, 22]       # test บน 3 Node.js versions
        os: [ubuntu-latest, windows-latest]  # และ 2 OS
      fail-fast: false                   # ถ้า 1 fail ยังรัน matrix อื่นต่อ

    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: npm ci
      - run: npm test
```

ผลลัพธ์: รัน **6 jobs** พร้อมกัน (3 versions × 2 OS) — รู้ทันทีว่า version ไหนพัง


## 🌍 Environments — staging vs production

**Environments** ใน GitHub Actions ช่วยแยก config และ protection rules ระหว่าง staging กับ production

### สร้าง Environment ใน GitHub

ไปที่ repo → **Settings → Environments → New environment**

ตั้งชื่อ: `staging` และ `production`

สำหรับ `production`:
- ✅ **Required reviewers** — รอให้คนอนุมัติก่อน deploy
- ✅ **Wait timer** — รอ 5 นาที (ช่วยให้ยกเลิกทัน)

### ใช้ Environment ใน Workflow

```yaml
jobs:
  deploy-staging:
    runs-on: ubuntu-latest
    environment:
      name: staging
      url: https://task-tracker-staging.onrender.com   # แสดงใน GitHub
    steps:
      - run: echo "Deploying to staging..."
      - run: curl -X POST ${{ secrets.RENDER_STAGING_HOOK }}

  deploy-production:
    needs: deploy-staging
    runs-on: ubuntu-latest
    environment:
      name: production
      url: https://task-tracker.onrender.com
    steps:
      - run: echo "Deploying to production..."
      - run: curl -X POST ${{ secrets.RENDER_PRODUCTION_HOOK }}
```


## 🔁 Reusable Workflows — แยก Workflow แล้วเรียกซ้ำ

แทนที่จะ copy-paste step เดิมในหลาย workflow — แยกออกมาเป็น reusable workflow

```yaml
# .github/workflows/_reusable-build.yml  (เริ่มด้วย _ = convention)
name: Build and Test (Reusable)

on:
  workflow_call:                        # ← สำหรับ reusable
    inputs:
      node-version:
        type: string
        default: '20'
    secrets:
      GHCR_TOKEN:
        required: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ inputs.node-version }}
          cache: 'npm'
      - run: npm ci && npm run build && npm test
```

```yaml
# .github/workflows/ci.yml — เรียกใช้ reusable workflow
jobs:
  call-build:
    uses: ./.github/workflows/_reusable-build.yml
    with:
      node-version: '20'
    secrets:
      GHCR_TOKEN: ${{ secrets.GHCR_TOKEN }}
```


## 🚀 Full Build → Push → Deploy Workflow

```yaml
name: CD Pipeline

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    outputs:
      image-tag: ${{ steps.meta.outputs.tags }}

    steps:
      - uses: actions/checkout@v4

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
            type=sha,prefix=,format=short
            type=raw,value=latest

      - name: Build and Push image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

  deploy:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Trigger Render deploy
        run: |
          curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"
```


## 💡 สรุป

::: info Advanced Patterns สรุป
| Pattern | ใช้เมื่อ |
| :--- | :--- |
| **Cache** | ทุก workflow — เร่ง npm install |
| **Artifacts** | เก็บ build output ส่งต่อระหว่าง jobs |
| **Matrix** | test บนหลาย Node version / OS |
| **Environments** | แยก staging/production + protection rules |
| **Reusable Workflow** | หลาย repo ใช้ build steps เดียวกัน |
:::


**← ก่อนหน้า:** [CI/CD Basics](/wk6/wk6-content1-cicd-basics)  
**ถัดไป →** [Deployment Workflow Patterns](/wk6/wk6-content3-workflow-patterns)
