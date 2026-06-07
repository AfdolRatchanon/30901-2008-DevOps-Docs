# Course Outline <Badge type="info" text="30901-2008" />

**รายวิชา:** 30901-2008 การพัฒนาซอฟต์แวร์รูปแบบเดฟออฟส์ (DevOps Style Software Development)
**หน่วยกิต:** 1-4-3 | **มาตรฐาน:** —


## 🎯 จุดประสงค์รายวิชา

::: info วัตถุประสงค์
1. **ด้านความรู้ (Knowledge):** อธิบายกระบวนการ DevOps, วัฒนธรรม Three Ways และเครื่องมือที่ใช้ในการพัฒนาและดำเนินงานซอฟต์แวร์ได้
2. **ด้านทักษะ (Skills):** ใช้ Git, Linux, Docker และ GitHub Actions สร้าง CI/CD Pipeline และ Deploy ซอฟต์แวร์ขึ้น Production ได้
3. **ด้านคุณลักษณะ (Attitude):** มีความละเอียดรอบคอบ รับผิดชอบ สื่อสารในทีมได้ มีการคิดเชิงนวัตกรรมและทำงานเป็นทีม
:::


## 🏗️ โปรเจกต์หลักประจำวิชา

> **"Task Tracker — DevOps Pipeline"**
> นักเรียนสร้าง REST API + Static Frontend สำหรับจัดการ Task ของตนเองตั้งแต่ศูนย์
> แล้วนำ DevOps pipeline ครอบตั้งแต่ต้นจนถึง production จริง
> ครอบคลุม: Linux Shell, Git Workflow, Docker, CI/CD, Testing, Deployment, Monitoring

::: tip ทำไมถึงเริ่มจากศูนย์?
ใน DevOps การเข้าใจ "ทุกขั้นตอน" ตั้งแต่ code บรรทัดแรกจนถึง user ใช้งานจริง
คือสิ่งที่แยก DevOps Engineer ออกจาก Developer ทั่วไป
:::


## 📅 ตารางเนื้อหา 9 โมดูล (18 สัปดาห์)

### Module 1 — DevOps Culture & Foundation <Badge type="tip" text="สัปดาห์ 1–2" />

| ประเภท | ไฟล์ | หัวข้อ | DevOps Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk1-content1-devops-intro](/wk1/wk1-content1-devops-intro) | DevOps คืออะไร, SDLC, Three Ways of DevOps | Culture & Mindset |
| ใบงาน | [wk1-lab1-env-setup](/wk1/wk1-lab1-env-setup) | ติดตั้ง WSL2, VS Code, Git, Node.js | Dev Environment |

**Learning Outcomes:** อธิบายความแตกต่างระหว่าง Traditional, Agile และ DevOps ได้ / ตั้งค่า Development Environment บน Windows ด้วย WSL2 ได้

**Ref Book:** The DevOps Handbook — Part I: The Three Ways


### Module 2 — Linux & Shell Script <Badge type="tip" text="สัปดาห์ 3–4" />

| ประเภท | ไฟล์ | หัวข้อ | DevOps Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk2-content1-linux-cli](/wk2/wk2-content1-linux-cli) | Linux CLI, Navigation, File System, Permissions | IT Operations |
| เนื้อหา | [wk2-content2-shell-script](/wk2/wk2-content2-shell-script) | Shell Script, Variables, Loops, Automation | Automation |
| ใบงาน | [wk2-lab1-automation](/wk2/wk2-lab1-automation) | เขียน Shell Script สำหรับ automate งานซ้ำๆ | Scripting Practice |

**Learning Outcomes:** ใช้คำสั่ง Linux พื้นฐาน (navigate, manage files, permissions) ได้ / เขียน Shell Script อัตโนมัติงานทำซ้ำได้

**Ref Book:** The Linux Command Line — Part I-II


### Module 3 — Git & GitHub <Badge type="tip" text="สัปดาห์ 5–6" />

| ประเภท | ไฟล์ | หัวข้อ | DevOps Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk3-content1-git-basics](/wk3/wk3-content1-git-basics) | Git Fundamentals, Add/Commit/Log/Diff/Reset | Version Control |
| เนื้อหา | [wk3-content2-github-collab](/wk3/wk3-content2-github-collab) | Branch, Merge, PR, Code Review, GitFlow | Collaboration |
| ใบงาน | [wk3-lab1-team-workflow](/wk3/wk3-lab1-team-workflow) | Simulate team workflow ด้วย PR + Code Review | Team Practice |

**Learning Outcomes:** ทำ Git workflow แบบ branch + PR ได้ / Review code ของเพื่อนผ่าน GitHub PR ได้

**Ref Book:** Pro Git — Chapter 1-3, 5


### Module 4 — Docker & Containerization <Badge type="tip" text="สัปดาห์ 7–8" />

| ประเภท | ไฟล์ | หัวข้อ | DevOps Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk4-content1-docker-basics](/wk4/wk4-content1-docker-basics) | Docker Concepts, Image, Container, Registry | Containerization |
| เนื้อหา | [wk4-content2-dockerfile-compose](/wk4/wk4-content2-dockerfile-compose) | Dockerfile, docker-compose, Networking, Volumes | Multi-container |
| ใบงาน | [wk4-lab1-containerize](/wk4/wk4-lab1-containerize) | Containerize Task Tracker (backend + frontend) | Container Practice |

**Learning Outcomes:** เขียน Dockerfile ได้ / ใช้ docker-compose รัน multi-container app ได้ / อธิบายความแตกต่าง VM vs Container ได้

**Ref Book:** Docker Deep Dive 2025 — Chapter 1-8


### Module 5 — Midterm Project Checkpoint <Badge type="danger" text="สัปดาห์ 9 (สอบกลางภาค)" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| Project | [wk5-midterm-exam](/wk5/wk5-midterm-exam) | ส่ง Task Tracker + Dockerized + Git history ครบ |

**เกณฑ์ประเมิน:**
- App รันได้ทั้ง local และ via Docker
- Dockerfile + docker-compose.yml ทำงานได้
- Git มี commit history ที่มีความหมาย (ไม่ใช่ "first commit" อย่างเดียว)
- มี README.md อธิบายวิธีรันโปรเจกต์


### Module 6 — CI/CD with GitHub Actions <Badge type="tip" text="สัปดาห์ 10–12" />

| ประเภท | ไฟล์ | หัวข้อ | DevOps Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk6-content1-cicd-basics](/wk6/wk6-content1-cicd-basics) | CI/CD Concepts, GitHub Actions Workflow Syntax | Automation |
| เนื้อหา | [wk6-content2-advanced-actions](/wk6/wk6-content2-advanced-actions) | Matrix, Secrets, Environments, Reusable Workflows | Advanced CI/CD |
| ใบงาน | [wk6-lab1-pipeline](/wk6/wk6-lab1-pipeline) | สร้าง pipeline: Build → Test → Push Docker image | Full Automation |

**Learning Outcomes:** สร้าง GitHub Actions workflow ได้ / ทำ Auto-build + Push Docker image ทุกครั้งที่ push ได้ / จัดการ Secrets อย่างปลอดภัยได้

**Ref Book:** Learning GitHub Actions — Chapter 1-7


### Module 7 — Testing & Quality Assurance <Badge type="tip" text="สัปดาห์ 13–14" />

| ประเภท | ไฟล์ | หัวข้อ | DevOps Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk7-content0-testing-strategy](/wk7/wk7-content0-testing-strategy) | Testing Strategy: Unit / SIT / UAT → DevOps | QA Strategy |
| เนื้อหา | [wk7-content1-unit-testing](/wk7/wk7-content1-unit-testing) | Unit Test, Jest, Coverage, TDD เบื้องต้น | Software Quality |
| เนื้อหา | [wk7-content2-security-quality](/wk7/wk7-content2-security-quality) | ESLint, OWASP basics, npm audit, SAST | Quality & Security |
| เนื้อหา | [wk7-content3-sit-integration](/wk7/wk7-content3-sit-integration) | SIT, Supertest, Integration Test, Approval Gate | System Integration |
| เนื้อหา | [wk7-content4-performance-testing](/wk7/wk7-content4-performance-testing) | k6 load test, RPS, P95 latency, threshold | Performance |
| ใบงาน | [wk7-lab1-test-pipeline](/wk7/wk7-lab1-test-pipeline) | Unit + SIT + quality gate + coverage ≥ 60% ใน CI | QA Automation |

**Learning Outcomes:** อธิบาย Unit/SIT/UAT ใน DevOps ได้ / เขียน Unit Test ด้วย Jest ได้ / ทำ SIT ด้วย Supertest ได้ / เพิ่ม quality gate ใน CI ได้

**Ref Book:** Alice and Bob Learn Application Security — Chapter 1-5


### Module 8 — Deployment & Monitoring <Badge type="tip" text="สัปดาห์ 15–16" />

| ประเภท | ไฟล์ | หัวข้อ | DevOps Focus |
| :--- | :--- | :--- | :--- |
| เนื้อหา | [wk8-content1-deployment](/wk8/wk8-content1-deployment) | Cloud Deploy (Render/Railway), Env Vars, 12-Factor App | Delivery |
| เนื้อหา | [wk8-content2-monitoring](/wk8/wk8-content2-monitoring) | Logging, Health Checks, Alerting, Observability | Stability |
| ใบงาน | [wk8-lab1-production](/wk8/wk8-lab1-production) | Deploy Task Tracker สู่ production + ตั้ง monitoring | Full Deployment |

**Learning Outcomes:** Deploy app ขึ้น cloud ได้ / ตั้งค่า environment variables อย่างปลอดภัยได้ / อ่าน logs เพื่อ debug production issues ได้

**Ref Book:** Beyond the 12-Factor App — All chapters


### Module 9 — Final Project <Badge type="danger" text="สัปดาห์ 17–18 (สอบปลายภาค)" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| Project | [wk9-final-exam](/wk9/wk9-final-exam) | ส่ง Task Tracker พร้อม full DevOps pipeline + นำเสนอ |

**เกณฑ์ประเมิน:**
- CI/CD pipeline ทำงานครบ (Build → Test → Push → Deploy อัตโนมัติ)
- App deploy บน cloud จริง เปิดได้จาก URL สาธารณะ
- Test coverage ≥ 60%
- มี monitoring / logging พื้นฐาน
- นำเสนอ pipeline ต่อหน้าชั้นเรียนและตอบ Code Review ได้


## 📊 สัดส่วนคะแนน

| หัวข้อ | คะแนน |
| :--- | :---: |
| คะแนนเก็บ (Lab wk1–wk4, wk6–wk8) | 40 |
| สอบกลางภาค (wk5 Midterm Project) | 20 |
| สอบปลายภาค (wk9 Final Project + Presentation) | 40 |
| **รวม** | **100** |


## 🛠️ Tech Stack ที่ใช้ในวิชา

::: code-group
```bash [Foundation]
Linux CLI (WSL2 on Windows)
Bash Shell Script
Git + GitHub
```
```bash [Container]
Docker Engine
Dockerfile
Docker Compose
Docker Hub (Registry)
```
```bash [Automation]
GitHub Actions (CI/CD)
Jest (Unit & Integration Testing)
ESLint (Code Quality)
```
```bash [Project App]
Node.js + Express (REST API)
HTML / CSS / JavaScript (Static Frontend)
JSON file storage (ไม่ต้องตั้ง DB)
Render / Railway (Cloud Deployment)
```
:::


## 📚 Reference Books

| หนังสือ | ใช้ใน Module |
| :--- | :--- |
| The DevOps Handbook — Gene Kim | M1 |
| The Linux Command Line | M2 |
| Pro Git | M3 |
| Docker Deep Dive 2025 | M4 |
| Learning GitHub Actions | M6 |
| Alice and Bob Learn Application Security | M7 |
| Beyond the 12-Factor App | M8 |
