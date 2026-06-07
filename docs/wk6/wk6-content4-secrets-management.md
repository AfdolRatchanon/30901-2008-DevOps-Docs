# Secrets Management & Dependabot <Badge type="info" text="Module 6 · สัปดาห์ 10–12" />

> **Ref Book:** Alice and Bob Learn Application Security — Chapter 5


## 💣 ทำไม Secrets ถึงสำคัญมาก?

**เรื่องจริงที่เกิด:** นักพัฒนา commit AWS Access Key ขึ้น GitHub โดยไม่ตั้งใจ  
Bot scan GitHub ตลอด 24/7 → ภายใน **4 นาที** key ถูกนำไปใช้  
ค่าใช้จ่าย AWS ภายใน 24 ชั่วโมง: **$50,000+**

```bash
# Secret ที่ห้าม commit เด็ดขาด
API_KEY=sk-xxxxxxxxxxxxxxxxxxxxxxxx
DATABASE_URL=postgres://user:password@host/db
JWT_SECRET=my-super-secret-key
AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
GITHUB_TOKEN=ghp_xxxxxxxxxxxxxxxxxxxx
```


## ❌ Anti-patterns ที่ต้องหลีกเลี่ยง

```typescript
// ❌ 1. Hardcode ใน source code
const DB_URL = 'postgres://admin:password123@prod-db:5432/app'
const API_KEY = 'sk-real-api-key-here'

// ❌ 2. ใน Dockerfile
ENV JWT_SECRET=my-real-secret

// ❌ 3. Commit .env จริงขึ้น GitHub
// ใน .gitignore ไม่มี .env → push ขึ้น repo เลย

// ❌ 4. ใน docker-compose.yml
services:
  api:
    environment:
      DB_PASSWORD: plaintext-password-here
```


## ✅ Patterns ที่ถูกต้อง

### Pattern 1: `.env` สำหรับ Local Development

```bash
# .env (บนเครื่อง dev — ไม่ commit)
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://admin:localpass@localhost:5432/taskdb
JWT_SECRET=dev-only-secret-not-for-production

# .env.example (commit ได้ — template สำหรับทีม)
PORT=3000
NODE_ENV=development
DATABASE_URL=postgres://USER:PASSWORD@HOST:5432/DBNAME
JWT_SECRET=REPLACE_WITH_STRONG_SECRET
```

```bash
# .gitignore ต้องมี
.env
.env.*
!.env.example    # exception: .env.example commit ได้
```

### Pattern 2: GitHub Secrets สำหรับ CI/CD

ตั้งค่า: repo → **Settings → Secrets and variables → Actions → New repository secret**

```yaml
# ใช้ใน workflow
steps:
  - name: Login to GHCR
    uses: docker/login-action@v3
    with:
      registry: ghcr.io
      username: ${{ github.actor }}
      password: ${{ secrets.GITHUB_TOKEN }}   # ← built-in อัตโนมัติ

  - name: Deploy to Render
    run: curl -X POST "${{ secrets.RENDER_DEPLOY_HOOK }}"

  - name: Send notification
    env:
      SLACK_TOKEN: ${{ secrets.SLACK_BOT_TOKEN }}   # ← จาก repo secrets
    run: ./notify.sh
```

::: tip GITHUB_TOKEN — Secret พิเศษที่มีให้อัตโนมัติ
`secrets.GITHUB_TOKEN` สร้างให้ทุก workflow run โดยอัตโนมัติ  
ใช้สำหรับ: push image ไป GHCR, comment บน PR, สร้าง release  
ไม่ต้องตั้งเองและ expire หลัง job จบ
:::

### Pattern 3: Cloud Platform Env Vars สำหรับ Production

Render Dashboard → Service → **Environment** → เพิ่ม key-value

```
NODE_ENV     = production
PORT         = 3000
DATABASE_URL = postgres://...     ← จาก Render PostgreSQL
JWT_SECRET   = $(openssl rand -hex 32)  ← generate ก่อนใส่
```


## 🔍 Secret Scanning — GitHub แจ้งเตือนอัตโนมัติ

GitHub scan ทุก commit หา patterns ที่เหมือน secret:

```
GitHub → repo → Security → Secret scanning alerts
```

ถ้าเปิดใช้งาน (ฟรีสำหรับ public repo):
- แจ้งผ่าน email ทันทีที่พบ
- แสดง commit ที่มี secret
- แนะนำให้ revoke token ทันที

::: warning ถ้าเผลอ commit secret แล้ว
```bash
# 1. Revoke/rotate token ทันที (ก่อนทำอย่างอื่น)
# 2. ลบออกจาก Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
git push origin --force --all

# หรือใช้ BFG Repo Cleaner (ง่ายกว่า)
bfg --delete-files .env
```
:::


## 🤖 Dependabot — Auto Update Dependencies

**Dependabot** คือ bot ของ GitHub ที่สร้าง PR อัปเดต dependency อัตโนมัติ  
ตั้งค่าในไฟล์เดียว — ทำงานเองทุกสัปดาห์

### ตั้งค่า `.github/dependabot.yml`

```yaml
# .github/dependabot.yml
version: 2
updates:

  # ── npm dependencies ─────────────────────────────
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"        # สร้าง PR ทุกสัปดาห์จันทร์
      day: "monday"
      time: "09:00"
      timezone: "Asia/Bangkok"
    open-pull-requests-limit: 5   # สร้างไม่เกิน 5 PR ต่อครั้ง
    labels:
      - "dependencies"
      - "automated"
    commit-message:
      prefix: "chore"           # ใช้ conventional commits
      include: "scope"

  # ── GitHub Actions ───────────────────────────────
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
    labels:
      - "ci"
      - "automated"
```

### Dependabot PR ที่สร้างให้

```
✅ chore(deps): bump express from 4.18.2 to 4.19.0
✅ chore(deps): bump @types/node from 20.8.0 to 20.11.0
⚠️ chore(deps): bump axios from 1.4.0 to 1.6.8 (security fix for CVE-2024-xxx)
```

::: tip ตั้ง Auto-merge สำหรับ patch updates
```yaml
# .github/workflows/dependabot-auto-merge.yml
on:
  pull_request:

jobs:
  auto-merge:
    if: github.actor == 'dependabot[bot]'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Auto merge patch/minor
        run: gh pr merge --auto --squash "$PR_URL"
        env:
          PR_URL: ${{ github.event.pull_request.html_url }}
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
:::


## 🔄 Secret Rotation — เปลี่ยน Secret เป็นประจำ

**ทำไมต้อง Rotate?**
- ถ้า secret หลุด — ลด damage window
- มาตรฐาน compliance (PCI-DSS, SOC2)
- บางองค์กรบังคับ rotate ทุก 90 วัน

**วิธี Rotate ใน GitHub:**

1. Generate secret ใหม่ (ใน Render/AWS/etc.)
2. ไปที่ repo → Settings → Secrets → Update
3. ทดสอบ workflow ว่ายังทำงาน
4. Revoke secret เก่า

::: info ใน course นี้ minimum ที่ต้องทำ
- ไม่ commit `.env` หรือ secret ใดๆ ลง repo ✅
- ใช้ GitHub Secrets สำหรับทุกค่าที่ sensitive ✅
- มี `.env.example` ที่ไม่มีค่าจริง ✅
- Dependabot เปิดใช้งาน ✅
:::


## 💡 สรุป

::: info กฎ Secrets แบบจำง่าย
```
Local dev  → .env  (ใน .gitignore เสมอ)
CI/CD      → GitHub Secrets
Production → Cloud platform env vars (Render dashboard)
Code       → ไม่มี secret เลย แม้แต่ตัวเดียว
```
:::


**← ก่อนหน้า:** [Deployment Patterns](/wk6/wk6-content3-workflow-patterns)  
**ถัดไป →** [Lab 1: Build Pipeline](/wk6/wk6-lab1-pipeline)
