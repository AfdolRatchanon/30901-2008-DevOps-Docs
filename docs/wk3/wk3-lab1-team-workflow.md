# Lab: Team Workflow — Branch, PR & Code Review <Badge type="tip" text="Module 3 · Lab 1" />

> **เป้าหมาย:** เห็น Pull Request ของตนเองถูก Merge เข้า repo หลักสำเร็จ ✅


## 📋 สิ่งที่ต้องทำ

1. Fork และ Clone repo Task Tracker
2. ตั้งค่า Husky + Prettier + commitlint
3. สร้าง branch ตามชื่อตัวเอง
4. เพิ่ม feature เล็กๆ ด้วย Conventional Commits
5. สร้าง Pull Request พร้อม description ครบ
6. Review PR ของเพื่อนอย่างน้อย 1 คน
7. แก้ตาม feedback แล้ว push อีกครั้ง


## ขั้นตอนที่ 1 — Fork & Clone

### 1.1 Fork & Clone จาก repo ต้นแบบ

เพื่อความต่อเนื่องของโปรเจกต์ เราจะใช้โค้ด **Starter** ที่ครูเตรียมโครงสร้าง API พื้นฐานไว้ให้เป็นฐานในการทำงานตลอดทั้งวิชาครับ

::: tip จะใช้ repo ไหน?
**ถ้าอยู่ในชั้นเรียน:** รับ URL ของ Starter repo จากครู แล้ว Fork จาก repo นั้นได้เลย  
**ถ้าเรียนด้วยตัวเอง:** ใช้ repo `task-tracker` ที่สร้างไว้ใน Lab wk2 หรือสร้างใหม่ตามขั้นตอน Fallback ด้านล่าง
:::

```bash
# 1. เข้าไปที่ URL repo ต้นแบบบน GitHub (รับลิงก์จากครูในชั้นเรียน)
# 2. กดปุ่ม Fork มุมขวาบน เพื่อคัดลอกโปรเจกต์มาเป็นของตัวเอง

# แทนที่ YOUR_USERNAME ด้วย GitHub username ของคุณ
 git clone git@github.com:YOUR_USERNAME/task-tracker.git
cd task-tracker

# เพิ่ม upstream (repo ต้นแบบ) เอาไว้ดึงอัปเดตจากครูในอนาคต — แทนที่ TEACHER_USERNAME ด้วย username ของครู
git remote add upstream git@github.com:TEACHER_USERNAME/task-tracker.git

# ตรวจสอบ remote
git remote -v
# origin    git@github.com:YOUR_USERNAME/task-tracker.git
# upstream  git@github.com:TEACHER_USERNAME/task-tracker.git
```

::: details 🛠️ Fallback: ไม่มี URL จากครู — สร้างโปรเจกต์เองได้เลย
ถ้าไม่มี Starter repo ให้ไปใช้ ให้สร้าง repo ใหม่บน GitHub แล้ว init โปรเจกต์ด้วยตัวเอง:

```bash
# 1. สร้าง repo บน GitHub.com ชื่อ "task-tracker"
# 2. Clone ลงมา
 git clone git@github.com:YOUR_USERNAME/task-tracker.git
cd task-tracker

# 3. สร้างโครงสร้างพื้นฐาน
mkdir -p src/routes src/types tests
touch src/index.ts src/app.ts src/routes/tasks.ts

# 4. ติดตั้ง dependencies
npm init -y
npm install express
npm install --save-dev typescript @types/express @types/node ts-node
npx tsc --init

# 5. Commit โครงสร้างเก่า
git add .
git commit -m "feat: initial project structure"
```
แล้วดำเนินขั้นตอนถัดไปได้เลยครับ
:::


## ขั้นตอนที่ 2 — ติดตั้ง Dependencies & Dev Tools

```bash
# ติดตั้ง dependencies ทั้งหมด
npm install

# ติดตั้ง dev tools
npm install --save-dev \
  husky \
  lint-staged \
  prettier \
  @commitlint/cli \
  @commitlint/config-conventional
```

### ตั้งค่า Prettier

```bash
cat > .prettierrc << 'EOF'
{
  "semi": false,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
EOF

cat > .prettierignore << 'EOF'
node_modules/
dist/
EOF
```

### ตั้งค่า commitlint

```bash
cat > commitlint.config.js << 'EOF'
module.exports = { extends: ['@commitlint/config-conventional'] }
EOF
```

### เปิดใช้งาน Husky

```bash
npx husky init
```

### ตั้งค่า `.husky/pre-commit`

```bash
cat > .husky/pre-commit << 'EOF'
npx lint-staged
EOF
```

### ตั้งค่า `.husky/commit-msg`

```bash
cat > .husky/commit-msg << 'EOF'
npx --no -- commitlint --edit $1
EOF
```

### เพิ่มใน `package.json`

```json
{
  "scripts": {
    "prepare": "husky",
    "format": "prettier --write .",
    "format:check": "prettier --check ."
  },
  "lint-staged": {
    "*.ts": ["eslint --fix", "prettier --write"],
    "*.{json,md}": ["prettier --write"]
  }
}
```

### ทดสอบ Hooks

```bash
# ทดสอบ commitlint
echo "bad commit" | npx commitlint
# ✖ type may not be empty → ผิด format!

echo "feat: test commit" | npx commitlint
# ✔ commit message ถูกต้อง

# ทดสอบ prettier
npx prettier --check .
```


## ขั้นตอนที่ 3 — สร้าง Branch

```bash
# branch ชื่อ feat/YOURNAME-เรื่องที่ทำ
git switch -c feat/somchai-add-sample-tasks

# ตรวจสอบว่าอยู่ branch ถูก
git branch
# * feat/somchai-add-sample-tasks
#   main
```


## ขั้นตอนที่ 4 — เพิ่ม Feature ตัวอย่าง (Mock Data)

เนื่องจาก Starter Repo เตรียมโค้ดเส้นทาง Backend API รอไว้ให้เราครบถ้วนแล้ว 
หน้าที่ของเราคือการแทรกตัวข้อมูลสมมติลงไปใน Memory ระบบก่อน เพื่อฝึกเขียนโค้ดเพิ่มเติมและเปิด PR นำเสนอส่วนนั้นครับ

เปิดไฟล์ `src/routes/tasks.ts` และเพิ่มข้อมูลจำลอง 1-2 รายการลงในตัวแปร `tasks` ที่เคยเป็น Array ว่าง ๆ:

```typescript
// src/routes/tasks.ts
import { Router } from 'express'
import { randomUUID } from 'crypto'
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task'

export const taskRouter = Router()

// [1] In-memory storage — จะย้ายไปฐานข้อมูลทีหลัง
let tasks: Task[] = [
  {
    id: "uuid-1234-abcd",
    title: 'ตั้งค่า Dev Environment ของตัวเอง',
    done: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "uuid-5678-efgh",
    title: 'สร้าง Pull Request แรกในชีวิต',
    done: false,
    createdAt: new Date().toISOString(),
  }
]
// โค้ดเดิมคงไว้...
```


## ขั้นตอนที่ 5 — Commit ด้วย Conventional Format

```bash
# ดูไฟล์ที่เปลี่ยน
git status
git diff

# Stage ไฟล์
git add src/routes/tasks.ts

# Commit (Husky จะรัน lint-staged อัตโนมัติ)
git commit -m "feat: add initial mock tasks data in memory"

# ดู commit log
git log --oneline
```

::: warning ถ้า lint มี error
Husky จะ block commit — ต้องแก้ให้ผ่านก่อน:
```bash
npx eslint --fix src/routes/tasks.ts
npx prettier --write src/routes/tasks.ts
git add .             # stage ไฟล์ที่แก้แล้ว
git commit -m "feat: ..."  # ลองใหม่
```
:::


## ขั้นตอนที่ 6 — Push & สร้าง Pull Request

```bash
# Push branch ขึ้น GitHub ของตัวเอง
git push origin feat/somchai-add-sample-tasks
```

ไปที่ GitHub → จะเห็นปุ่ม **"Compare & pull request"** → คลิก

### เขียน PR Description ให้ครบ

```markdown
## สิ่งที่เปลี่ยนแปลง
- เพิ่ม Mock Data จำลองลงในไฟล์ `src/routes/tasks.ts` จำนวน 2 รายการ

## วิธีทดสอบ
```bash
npm run dev
curl http://localhost:3000/tasks
```
Expected response:
```json
[
  { "id": "uuid-1234-abcd", "title": "ตั้งค่า Dev Environment ของตัวเอง", "done": true, "createdAt": "..." },
  { "id": "uuid-5678-efgh", "title": "สร้าง Pull Request แรกในชีวิต", "done": false, "createdAt": "..." }
]
```

## Checklist
- [x] code ผ่าน ESLint
- [x] code ผ่าน Prettier
- [x] ทดสอบ endpoint local แล้ว
- [x] Commit message ใช้ Conventional Commits

Closes #3
```


## ขั้นตอนที่ 7 — Review PR ของเพื่อน

ไปที่ repo หลัก → **Pull Requests** → เลือก PR ของเพื่อน → **Files changed**

ให้ comment อย่างน้อย **2 ข้อ**:

```markdown
# ตัวอย่าง comment ที่ดี

## Comment 1 — แนะนำปรับปรุง
Line 12: ควรเพิ่ม field "priority" ด้วยจะได้ฝึกใช้ตอน filter
เช่น: priority: 'high' | 'medium' | 'low'

## Comment 2 — ตรวจพบปัญหา
Line 28: ชื่อ variable "dt" ไม่สื่อความหมาย 
แนะนำเปลี่ยนเป็น "createdAt" ให้ชัดขึ้น

## Comment 3 — Approve
LGTM! โค้ดสะอาด อ่านเข้าใจง่าย ✅
```


## ขั้นตอนที่ 8 — แก้ตาม Feedback

```bash
# แก้ไขตาม comment ของ reviewer
# ...แก้ไฟล์...

# Commit การแก้ไข
git add .
git commit -m "fix: add priority field to sample tasks per review feedback"

# Push ขึ้น branch เดิม (PR จะอัพเดตอัตโนมัติ)
git push origin feat/somchai-add-sample-tasks
```


## ✅ เกณฑ์การส่งงาน Lab 1

| รายการ | คะแนน |
| :--- | :---: |
| PR ถูก merge เข้า repo หลัก | 2 |
| Commit message ทุกอันเป็น Conventional Commits | 1 |
| Husky hooks ทำงานได้ (evidence ใน PR) | 1 |
| Review PR เพื่อนพร้อม comment ที่มีประโยชน์ | 1 |
| **รวม** | **5** |

**ส่ง:** link ของ Pull Request ที่ถูก merge แล้ว + Screenshot ของ comment ที่ review PR เพื่อน


**← ก่อนหน้า:** [Git Advanced](/wk3/wk3-content3-git-advanced)  
**Module ถัดไป →** [Module 4: Docker Basics](/wk4/wk4-content1-docker-basics)
