# 📘 DevOps Course Content Pattern & Standard

คู่มือและมาตรฐานการเขียนเนื้อหารายวิชา **30901-2008 DevOps Style Software Development**
ออกแบบมาเพื่อการจัดการเรียนการสอนอาชีวศึกษา (Active Learning + PjBL + MIAP + CLIL)

> 🤖 **AI-Generated Textbook:** เอกสารนี้เป็น "แม่แบบ (Blueprint)" ที่ปรับจาก course pattern หลัก ให้เหมาะกับบริบท DevOps ที่เน้น Terminal, Git, Docker, CI/CD — ไม่ใช่ UI/Frontend


## 📖 วิชานี้คืออะไร?

เอกสารรายวิชา DevOps ที่สร้างด้วย VitePress ใช้โปรเจกต์ **Task Tracker API (Node.js + TypeScript + Docker)** เป็นด้ายเชื่อมตลอด 9 สัปดาห์ นักเรียนสร้างระบบเดียวตั้งแต่ `git init` จนถึง deploy บน production พร้อม CI/CD pipeline


## 📚 Reference Books (หนังสืออ้างอิงประจำวิชา)

หนังสือทั้งหมดอยู่ใน folder `Ref Book/` — ทุก content page ต้องระบุ Ref Book + บทที่อ้างอิง

| หนังสือ | ใช้ใน Module | โฟกัสหลัก |
| :--- | :--- | :--- |
| **The DevOps Handbook** — Gene Kim et al. | M1, M3, M6, M8 | Three Ways, Value Stream, Culture, CI/CD Principles |
| **The Linux Command Line** — William Shotts | M2 | CLI, Shell Scripting, Cron, Automation |
| **Pro Git** — Scott Chacon | M3 | Git internals, Branching, Merging, Rebase, GitHub Flow |
| **Docker Deep Dive 2025** — Nigel Poulton | M4 | Dockerfile, Compose, Registry, Networking, Volumes |
| **Learning GitHub Actions** — Brent Laster | M6 | Workflow syntax, Triggers, Jobs, Secrets, Environments |
| **Beyond the 12-Factor App** — Kevin Hoffman | M8 | 12-Factor App, Cloud-native principles, Deployment |
| **Alice and Bob Learn Application Security** — Tanya Jain | M7 | OWASP, Shift-Left Security, Secret Management |
| **Terraform Up and Running** — Yevgeniy Brikman | M8 | Infrastructure as Code, Terraform basics |
| **Jenkins 2 Up and Running** — Brent Laster | M6 (เปรียบเทียบ) | CI/CD concepts (ใช้เปรียบกับ GitHub Actions) |

### Ref Book ตาม Module

| Module | Ref Book หลัก | บทที่แนะนำ |
| :--- | :--- | :--- |
| **M1** (wk1-2): DevOps Intro | The DevOps Handbook | Part I: The Three Ways |
| **M2** (wk2): Linux CLI | The Linux Command Line | Ch. 1–5, 24–25 (Shell scripting) |
| **M3** (wk3): Git Workflow | Pro Git | Ch. 2–3 (Branching), Ch. 6 (GitHub) |
| **M4** (wk4): Docker | Docker Deep Dive 2025 | Ch. 4–10 (Images, Containers, Compose) |
| **M5** (wk5): Midterm | รวม M1–M4 | — |
| **M6** (wk6): CI/CD | Learning GitHub Actions | Ch. 1–4, 7–8 (Workflows, Secrets) |
| **M7** (wk7): Testing & Security | Alice and Bob + DevOps Handbook | Security Ch., Part III |
| **M8** (wk8): Production | Beyond the 12-Factor App + Terraform | Ch. 1–5 |
| **M9** (wk9): Wrap-up | The DevOps Handbook | Part V: Conclusion |



## ✨ จุดเด่น (Key Features)

- **Command-First Examples** — Terminal command + expected output มาก่อนทฤษฎีเสมอ
- **Progressive Difficulty** — ทุกบทเริ่มง่าย แล้วค่อย ๆ เพิ่มความซับซ้อนทีละขั้น
- **MIAP Flow** — ทุกหน้าเดินตาม Motivation → Information → Application → Progress (ซ่อนอยู่ใต้เนื้อหา)
- **CLIL Integration** — command, flag, config ทุกชิ้นใช้ภาษาอังกฤษ มีคลังคำศัพท์ท้ายบท
- **Production Scenario Hook** — เปิดทุกบทด้วยปัญหาจาก production ที่นักเรียนจะเจอจริง
- **Student Identity in Lab** — task แรกของทุก Lab คือใส่ชื่อใน git config / comment ใน script
- **Code Review Prep** — คำถาม 3-4 ข้อท้ายบท เน้น "ทำไม" ไม่ใช่ท่อง


## ⚙️ คำชี้แจงสำหรับ AI (AI Generator Instructions)

เมื่อ AI ได้รับคำสั่งให้สร้างเนื้อหา AI ต้อง:

1. **Command-First:** เริ่มด้วย terminal command + expected output ที่รันได้จริงก่อนเสมอ — อธิบายทฤษฎีแทรกในโค้ด ไม่ใช่ก่อนโค้ด
2. **เรียงง่ายไปยาก:** เวอร์ชัน 1 (พื้นฐาน) → เวอร์ชัน 2 (เพิ่มความสามารถ) ภายในบทเดียวกัน
3. **ตัวอย่างเยอะ:** ทุก concept ต้องมีอย่างน้อย 2 ตัวอย่าง — ✅ ถูก (ทำได้ผล) และ ❌ ผิด (anti-pattern)
4. **สอดแทรกบริบท** "Task Tracker API" ในทุกตัวอย่าง — ไม่ใช้ตัวอย่างลอย ๆ เช่น `hello-world`
5. **Expected Output:** ทุก terminal command ต้องมีสิ่งที่นักเรียนควรเห็น — ตรวจสอบตัวเองได้
6. **Student Identity:** task แรกของทุก Lab = ใส่ชื่อนักเรียนใน git config หรือ comment


## 📁 Naming Convention

| Pattern | ใช้สำหรับ | ตัวอย่าง |
| :--- | :--- | :--- |
| `wkX-contentY-topic.md` | บทเรียนทฤษฎี | `wk4-content1-docker-basics.md` |
| `wkX-labY-topic.md` | ใบงานปฏิบัติ | `wk4-lab1-containerize.md` |
| `wkX-midterm-exam.md` | จุดเช็คพอยต์กลางภาค | `wk5-midterm-exam.md` |
| `wkX-final-exam.md` | จุดเช็คพอยต์ปลายภาค | `wk9-final-exam.md` |

(X = โมดูลที่ 1-9, Y = ลำดับเนื้อหาในโมดูลนั้น)


## 🏅 DevOps Gold Standard — Layout Blueprint

ทุกหน้าต้องสอดแทรก **MIAP + CLIL + PjBL** ไว้ในเนื้อหาอย่างเป็นธรรมชาติ
**ห้ามใส่ label ว่า "M: Motivation" หรือ "I: Information"** — นักเรียนต้องไม่รู้ตัวว่ากำลังอยู่ขั้นไหน


## 📄 TEMPLATE 1 — Content Page

~~~markdown
# ชื่อหัวข้อ <Badge type="info" text="Module X · สัปดาห์ Y–Z" />

> **Ref Book:** [ชื่อหนังสือ — บทที่เกี่ยวข้อง]

<!-- MIAP-M: เปิดด้วยปัญหาจาก production ที่น่าปวดหัว -->
::: danger 🚨 สถานการณ์จริง
[อธิบาย scenario ที่นักเรียนจะเจอจริงถ้าไม่รู้เรื่องนี้]
เช่น: "push code แล้ว production ล่มตอนตี 2 แต่ไม่รู้ว่าเกิดอะไรขึ้น"
:::

> 💡 **เปรียบเทียบ:** [อุปมาเชื่อมกับชีวิตประจำวัน ทำให้จำได้]


<!-- MIAP-I: เนื้อหาหลัก — Command-First, เรียงง่ายไปยาก -->

## [หัวข้อหลัก]

```bash
# [อธิบายว่าทำอะไร]
คำสั่งที่รัน

# ต้องเห็น output แบบนี้:
# ผลลัพธ์ที่ถูกต้อง
```


<!-- MIAP-A: AI Prompt Guide -->
## 🤖 AI Prompt Guide

::: info 💬 ถาม AI เมื่อติดปัญหา
"ฉันกำลังทำ [context] แต่เจอ error นี้: [error message]
รัน command นี้: [command]
ช่วยอธิบายสาเหตุและวิธีแก้ที่เหมาะกับ DevOps project หน่อย"
:::


<!-- MIAP-P: วัดผล — Code Review + CLIL -->
## ✅ Progress Check

### 🗣️ Code Review

::: details ❓ คำถาม 1: [เปรียบเทียบ A vs B]
**แนวคำตอบ:** [อธิบาย "ทำไม" ไม่ใช่แค่ "อะไร"]
:::

::: details ❓ คำถาม 2: [กลไกการทำงาน]
**แนวคำตอบ:** [อธิบายเป็นลำดับขั้นตอน]
:::

::: details ❓ คำถาม 3: [สถานการณ์จริง — ถ้า X ทำอะไร?]
**แนวคำตอบ:** [Detect → Investigate → Mitigate → Resolve]
:::


### 📚 CLIL Vocabulary

| Technical Term | ความหมายในบริบท DevOps |
| :--- | :--- |
| `term` | ความหมายที่ใช้จริงในบทนี้ |


**← ก่อนหน้า:** [ชื่อหน้าก่อน](/path)
**ถัดไป →** [ชื่อหน้าถัดไป](/path)
~~~


## 🔧 TEMPLATE 2 — Lab Page

~~~markdown
# Lab Y: [ชื่อ Lab] <Badge type="tip" text="Module X · Lab Y" />

> **เป้าหมาย:** [ประโยคเดียวบอกว่าสำเร็จเมื่อไหร่] ✅


## 📋 สิ่งที่ต้องทำ

1. [รายการ 4-6 ข้อ]


<!-- Student Identity — บังคับทุก Lab -->
## ขั้น 0: ระบุตัวตน (2 นาที)

```bash
git config user.name   # ต้องเห็นชื่อของตนเอง
git config user.email
```

เพิ่ม comment ระบุตัวตนในไฟล์งานหลัก:
```bash
# Lab wkX: [ชื่อ Lab] — จัดทำโดย ชื่อ-นามสกุล รหัส XXXXX
```
ใช้รูปแบบเดียวกันกับ TypeScript (`//`), Dockerfile (`#`), YAML (`#`)

- [ ] ชื่อของตนปรากฏใน `git config user.name` ✅
- [ ] มี comment ระบุตัวตนในไฟล์งานหลัก ✅


## ขั้นตอนที่ 1 — [ชื่อ] (X นาที)

```bash
# คำสั่ง
คำสั่งที่รัน

# ต้องเห็น:
# ✅ ผลลัพธ์ที่ถูกต้อง
```

- [ ] task → ต้องเห็น [expected outcome] ✅


## ขั้นตอนที่ N — ทดสอบ Failure Case (5 นาที)

> DevOps principle: "ถ้าไม่รู้ว่า fail หน้าตาเป็นอย่างไร — จะแก้ไม่ถูกเมื่อ production ล่ม"

- [ ] [ทำสิ่งที่ผิดโดยตั้งใจ] → ต้องเห็น error ✅
- [ ] อ่าน error message — บอกอะไรบ้าง?
- [ ] แก้กลับ → กลับมาทำงานปกติ ✅


## 🎯 Bonus Task (ถ้าเวลาเหลือ)

- [ ] [ต่อยอดที่ยากขึ้น เช่น production-ready config, edge case, อ่าน official docs]


## ✅ เกณฑ์การส่งงาน

| รายการ | คะแนน |
| :--- | :---: |
| [เกณฑ์ที่ 1] | X |
| **รวม** | **5** |


## 📤 ส่งงาน

```bash
git add .
git commit -m "lab(wkX): [ชื่อ Lab] โดย ชื่อ-นามสกุล"
git push origin main
```

- [ ] Push ขึ้น GitHub ✅
- [ ] ส่งใน LMS: GitHub URL + Screenshot (terminal output / pipeline สีเขียว / URL)

::: tip 📝 เขียนสรุปสั้น ๆ ตอนส่งงาน
- เรียนรู้อะไร? ปัญหาที่เจอและวิธีแก้?
:::


**← ก่อนหน้า:** [ชื่อหน้าก่อน](/path)
**ถัดไป →** [ชื่อหน้าถัดไป](/path)
~~~


## 🎨 Information Section Patterns

### รูปแบบ 1: Command พร้อม Expected Output (บังคับทุก terminal command)

```bash
# [อธิบายว่า command นี้ทำอะไร]
docker build -t task-tracker .

# ต้องเห็น output แบบนี้ (อาจแตกต่างเล็กน้อย):
# [+] Building 12.3s (10/10) FINISHED
# Successfully tagged task-tracker:latest
```

**กฎ:** ทุก command ต้องมี expected output — นักเรียนรู้ว่า "สำเร็จ" หน้าตาเป็นอย่างไร


### รูปแบบ 2: ✅ ถูก / ❌ ผิด (สำหรับ Best Practice)

```bash
# ❌ แบบผิด — secret ใน code (อันตราย!)
DATABASE_URL=postgres://admin:password123@db:5432/app

# ✅ แบบถูก — อ่านจาก environment variable
DATABASE_URL=${DATABASE_URL}
```

**กฎ:** ✅/❌ ต้องมีในทุก concept ที่มี anti-pattern ที่นักเรียนมักทำผิด


### รูปแบบ 3: Annotated Config (สำหรับไฟล์ config สำคัญ)

```yaml
# docker-compose.yml — อธิบายทุก key ที่สำคัญ
services:
  api:
    build: .              # [1] build จาก Dockerfile ใน folder นี้
    ports:
      - "3000:3000"       # [2] host:container
    healthcheck:          # [3] Docker ตรวจสอบ app ทุก 30 วินาที
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
```

**สรุปการทำงาน:**
1. Docker build image
2. รัน container เปิด port 3000
3. ตรวจ health ทุก 30 วินาที

**กฎ:** ใช้ `# [1] [2]...` สำหรับ line สำคัญ ตามด้วย "สรุปการทำงาน:" เสมอ


### รูปแบบ 4: Progressive Versions (เวอร์ชันง่ายไปยาก)

```dockerfile
### Dockerfile เวอร์ชัน 1 — พื้นฐาน (รันได้แต่ไม่ปลอดภัย)
FROM node:20
WORKDIR /app
COPY . .
RUN npm install
CMD ["node", "src/index.js"]
```

รัน `docker build -t task-tracker .` → ต้องเห็น FINISHED ✅


```dockerfile
### Dockerfile เวอร์ชัน 2 — Multi-stage + Security
FROM node:20-alpine AS builder      # ← เพิ่ม: alpine เล็กกว่า 3x
WORKDIR /app
COPY package*.json ./
RUN npm ci                          # ← เปลี่ยน: ci แทน install (reproducible)
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/dist ./dist
USER node                           # ← เพิ่ม: non-root user
CMD ["node", "dist/index.js"]
```

Image เล็กลงและปลอดภัยขึ้น ✅

**กฎ:** ทุกเวอร์ชันต้องรันได้จริง — comment `← เพิ่ม:` หรือ `← เปลี่ยน:` บอกความต่าง


### รูปแบบ 5: โครงสร้างไฟล์ Project

```
task-tracker/
├── src/
│   ├── app.ts          ← Express app (export สำหรับ test)
│   ├── index.ts        ← Entry point (app.listen)
│   └── routes/tasks.ts ← Route handlers
├── tests/tasks.test.ts ← Integration tests
├── .github/workflows/  ← CI/CD pipeline
├── Dockerfile          ← Multi-stage build
└── .env.example        ← Template (ไม่มีค่า secret จริง)
```

::: tip 💡 ไฟล์สำคัญในแต่ละสัปดาห์
wk1-3: README + .gitignore · wk4: Dockerfile + compose · wk6: workflows/ · wk7: tests/
:::


## 🗣️ Code Review Pattern (DevOps)

```markdown
### 🗣️ Code Review

::: details ❓ คำถาม 1: [เปรียบเทียบ] — ทำไม X ดีกว่า Y?
**แนวคำตอบ:** [DevOps principle: reproducibility / security / speed]
:::

::: details ❓ คำถาม 2: [กลไก] — เกิดอะไรขึ้นเมื่อรัน X?
**แนวคำตอบ:** [ขั้นตอนที่เกิดขึ้นจริง เชื่อมกับ command ที่เพิ่งใช้]
:::

::: details ❓ คำถาม 3: [สถานการณ์] — ถ้า production ล่มเพราะ X ทำอะไรก่อน?
**แนวคำตอบ:** [Detect → Investigate → Mitigate → Resolve]
:::
```

**กฎ:**
- **3-4 คำถามต่อบท** เน้น: เปรียบเทียบ (A vs B) · กลไก (เกิดอะไรขึ้น) · สถานการณ์ (ถ้า X)
- แนวคำตอบต้องอธิบาย "ทำไม" ด้วย DevOps principle
- คำถามต้องเชื่อมกับ command/config ที่นักเรียนเพิ่งใช้


## 📚 CLIL Vocabulary Pattern

| Technical Term | ความหมายในบริบท DevOps |
| :--- | :--- |
| `pipeline` | ลำดับขั้นตอนอัตโนมัติ เช่น test → build → deploy |
| `artifact` | ผลลัพธ์จาก build เช่น Docker image, compiled binary |
| `idempotent` | รันกี่ครั้งก็ได้ผลเหมือนกัน — หลักการสำคัญของ IaC |
| `reproducible build` | build จากโค้ดเดิมได้ image เหมือนเดิมทุกครั้ง |

**กฎ:** อย่างน้อย 4-6 terms ต่อบท เลือกเฉพาะ term ที่ปรากฏจริงในบทนี้


## 🚫 Anti-Patterns (สิ่งที่ต้องหลีกเลี่ยง)

| ❌ ห้ามทำ | ✅ ควรทำแทน |
| :--- | :--- |
| ทฤษฎียาวก่อน command | command + expected output ก่อน อธิบายแทรกในโค้ด |
| Command ไม่มี expected output | แสดง output ทุกครั้ง |
| ตัวอย่างเดียวต่อ concept | อย่างน้อย 2 ตัวอย่าง: ✅ ถูก และ ❌ ผิด |
| Lab ไม่มี Student Identity | ขั้น 0 บังคับ: git config + comment |
| Lab ไม่มี Failure Case | ทดสอบ error อย่างน้อย 1 กรณี |
| Lab ไม่มี Bonus Task | เพิ่มเสมอ — คนเร็วจะไม่รอคนช้า |
| Code Review น้อยกว่า 3 ข้อ | อย่างน้อย 3 ข้อ เน้น "ทำไม" |
| ตัวแปร/ไฟล์ภาษาไทย | CLIL: ทุก identifier ต้องเป็นอังกฤษ |
| Config ไม่มี comment | บรรทัดสำคัญต้องมี `# [1] [2]...` |
| ไม่มี CLIL Vocabulary | ท้ายทุก content page อย่างน้อย 4 terms |
| Hook ไม่มี — เริ่มด้วยคำนิยาม | เปิดด้วย ::: danger สถานการณ์จริง + เปรียบเทียบ |
| ตัวอย่างใช้ `hello-world` | ใช้ Task Tracker API เป็น context เสมอ |


## 🔄 ความแตกต่างจาก React Course Pattern

| หัวข้อ | React (21901-2003) | DevOps (30901-2008) |
| :--- | :--- | :--- |
| Student Identity | Footer HTML บน browser | `git config user.name` + comment ในไฟล์ |
| Hook | ปัญหา UI/UX | Production scenario (pipeline crash, container fail) |
| Expected Output | "เห็นหน้าเว็บ" | Terminal output / pipeline สีเขียว / public URL |
| Submit | Push + Google Doc | Push + Screenshot terminal/pipeline/URL |
| CLIL Terms | React, Component, Props | Pipeline, Container, Registry, SLO, Artifact |
| Rubric | ทุก content page | เฉพาะ Lab ไม่ใช่ content page |
| Progressive Versions | Component v1 → v2 | Dockerfile v1 → v2, CI workflow v1 → v2 |
| Failure Case | TypeScript error | Container fail, pipeline block, CVE จาก npm audit |
| Bonus Task | เพิ่ม feature UI | production-ready, edge case, official docs |
