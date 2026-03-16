# Course Outline <Badge type="info" text="30901-2008" />

**รายวิชา:** 30901-2008 การพัฒนาซอฟต์แวร์รูปแบบเดฟออฟส์ (DevOps Style Software Development)
**หน่วยกิต:** 1-4-3 | **มาตรฐาน:** —

---

## 🎯 จุดประสงค์รายวิชา

::: info วัตถุประสงค์
1. **ด้านความรู้ (Knowledge):** อธิบายกระบวนการ DevOps, วัฒนธรรม Three Ways และเครื่องมือที่ใช้ในการพัฒนาและดำเนินงานซอฟต์แวร์ได้
2. **ด้านทักษะ (Skills):** ใช้ Git, Linux, Docker และ GitHub Actions สร้าง CI/CD Pipeline และ Deploy ซอฟต์แวร์ขึ้น Production ได้
3. **ด้านคุณลักษณะ (Attitude):** มีความละเอียดรอบคอบ รับผิดชอบ สื่อสารในทีมได้ มีการคิดเชิงนวัตกรรมและทำงานเป็นทีม
:::

---

## 🏗️ โปรเจกต์หลักประจำวิชา

> **"Task Tracker — DevOps Pipeline"**
> นักเรียนสร้าง REST API (TypeScript + Express) + Static Frontend จัดการ Task ของตนเอง
> นำ DevOps pipeline ครอบตั้งแต่ต้นจนถึง production จริงบน Render
> ครอบคลุม: Linux, Git, Docker, GitHub Actions (GHCR), Testing, Deploy, Monitoring

::: tip Project Milestone Map
| จบ Module | โปรเจกต์มี |
| :--- | :--- |
| M1 | Repo + README + folder structure |
| M2 | Shell script setup อัตโนมัติ |
| M3 | Branch history + PR + Husky hooks |
| M4 | Dockerfile + docker-compose (healthy) |
| **M5 Midterm** | ทุกอย่างข้างบนรวมกัน |
| M6 | CI/CD pipeline + README badges |
| M7 | Tests pass + quality gate + Dependabot |
| M8 | Live URL + monitoring + runbook |
| **M9 Final** | Full pipeline + presentation |
:::

---

## 📅 ตารางเนื้อหา 9 โมดูล (18 สัปดาห์)

### Module 1 — DevOps Foundation <Badge type="tip" text="สัปดาห์ 1–2" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk1-content1-devops-intro](/wk1/wk1-content1-devops-intro) | DevOps คืออะไร, Three Ways of DevOps |
| เนื้อหา | [wk1-content2-sdlc-evolution](/wk1/wk1-content2-sdlc-evolution) | SDLC: Waterfall → Agile → DevOps |
| เนื้อหา | [wk1-content3-value-stream](/wk1/wk1-content3-value-stream) | Value Stream — หา waste ใน delivery process |
| เนื้อหา | [wk1-content4-agile-devops](/wk1/wk1-content4-agile-devops) | Agile + DevOps, Sprint, GitHub Projects |
| เนื้อหา | [wk1-content5-dora-metrics](/wk1/wk1-content5-dora-metrics) | DORA Metrics — 4 ตัวชี้วัดทีม DevOps |
| ใบงาน | [wk1-lab1-env-setup](/wk1/wk1-lab1-env-setup) | ติดตั้ง WSL2, VS Code, Git, Node.js |

**Ref Book:** The DevOps Handbook — Part I

---

### Module 2 — Linux & Shell Script <Badge type="tip" text="สัปดาห์ 3–4" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk2-content1-linux-cli](/wk2/wk2-content1-linux-cli) | Linux CLI, Navigation, File System, Permissions |
| เนื้อหา | [wk2-content2-shell-script](/wk2/wk2-content2-shell-script) | Shell Script, Variables, Loops, Functions |
| เนื้อหา | [wk2-content3-text-processing](/wk2/wk2-content3-text-processing) | grep, sed, awk — วิเคราะห์ log จาก terminal |
| เนื้อหา | [wk2-content4-networking-devops](/wk2/wk2-content4-networking-devops) | DNS, Ports, HTTP/HTTPS, SSL, curl |
| ใบงาน | [wk2-lab1-automation](/wk2/wk2-lab1-automation) | เขียน Shell Script อัตโนมัติงานซ้ำ |
| ใบงาน | [wk2-lab2-log-analysis](/wk2/wk2-lab2-log-analysis) | วิเคราะห์ server log ด้วย shell จริง |

**Ref Book:** The Linux Command Line — Part I-II, Chapter 16, 19-20

---

### Module 3 — Git & GitHub <Badge type="tip" text="สัปดาห์ 5–6" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk3-content1-git-basics](/wk3/wk3-content1-git-basics) | Git Fundamentals, Conventional Commits |
| เนื้อหา | [wk3-content2-github-collab](/wk3/wk3-content2-github-collab) | Branch, PR, Code Review, Branch Protection |
| เนื้อหา | [wk3-content3-git-advanced](/wk3/wk3-content3-git-advanced) | Stash, Tags, Semantic Versioning, Husky + Prettier |
| ใบงาน | [wk3-lab1-team-workflow](/wk3/wk3-lab1-team-workflow) | Team workflow ด้วย PR + Code Review จริง |

**Ref Book:** Pro Git — Chapter 1-3, 5, 7

---

### Module 4 — Docker & Cloud <Badge type="tip" text="สัปดาห์ 7–8" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk4-content1-docker-basics](/wk4/wk4-content1-docker-basics) | Docker Image, Container, Registry, Docker Hub |
| เนื้อหา | [wk4-content2-dockerfile-compose](/wk4/wk4-content2-dockerfile-compose) | Dockerfile, Multi-stage build, docker-compose |
| เนื้อหา | [wk4-content3-docker-security](/wk4/wk4-content3-docker-security) | Non-root user, .dockerignore, Image scanning |
| เนื้อหา | [wk4-content4-cloud-fundamentals](/wk4/wk4-content4-cloud-fundamentals) | IaaS/PaaS/SaaS, Cloud regions, Render/Railway |
| ใบงาน | [wk4-lab1-containerize](/wk4/wk4-lab1-containerize) | Containerize Task Tracker + push ไป GHCR |
| ใบงาน | [wk4-lab2-compose-advanced](/wk4/wk4-lab2-compose-advanced) | healthcheck, depends_on, compose override |

**Ref Book:** Docker Deep Dive 2025 — Chapter 1-10, 16

---

### Module 5 — Midterm <Badge type="danger" text="สัปดาห์ 9 (สอบกลางภาค)" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| Project | [wk5-midterm-exam](/wk5/wk5-midterm-exam) | ส่ง Task Tracker + Dockerized + Git history |

---

### Module 6 — CI/CD with GitHub Actions <Badge type="tip" text="สัปดาห์ 10–12" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk6-content1-cicd-basics](/wk6/wk6-content1-cicd-basics) | CI/CD Concepts, Actions Workflow Syntax, `act` tool |
| เนื้อหา | [wk6-content2-advanced-actions](/wk6/wk6-content2-advanced-actions) | Matrix, Environments, Reusable Workflows, Cache |
| เนื้อหา | [wk6-content3-workflow-patterns](/wk6/wk6-content3-workflow-patterns) | Rolling, Blue-Green, Canary, Rollback strategy |
| เนื้อหา | [wk6-content4-secrets-management](/wk6/wk6-content4-secrets-management) | .env, GitHub Secrets, Dependabot |
| ใบงาน | [wk6-lab1-pipeline](/wk6/wk6-lab1-pipeline) | Build → Test → Push image to GHCR อัตโนมัติ |
| ใบงาน | [wk6-lab2-multi-environment](/wk6/wk6-lab2-multi-environment) | แยก staging/production + README badges |

**Ref Book:** Learning GitHub Actions — Chapter 1-9

---

### Module 7 — Testing & Quality <Badge type="tip" text="สัปดาห์ 13–14" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk7-content1-testing](/wk7/wk7-content1-testing) | Unit Test, Jest, Coverage, TDD เบื้องต้น |
| เนื้อหา | [wk7-content2-security-quality](/wk7/wk7-content2-security-quality) | ESLint, OWASP basics, npm audit, SAST |
| เนื้อหา | [wk7-content3-api-testing](/wk7/wk7-content3-api-testing) | Supertest, Integration Test, Error cases |
| เนื้อหา | [wk7-content4-performance-testing](/wk7/wk7-content4-performance-testing) | k6 load test, RPS, P95 latency, threshold |
| ใบงาน | [wk7-lab1-test-pipeline](/wk7/wk7-lab1-test-pipeline) | Test + quality gate + coverage ≥ 60% ใน CI |

**Ref Book:** Alice and Bob Learn Application Security — Chapter 1-5

---

### Module 8 — Deploy & Monitor <Badge type="tip" text="สัปดาห์ 15–16" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk8-content1-deployment](/wk8/wk8-content1-deployment) | Render deploy, Env vars, 12-Factor App |
| เนื้อหา | [wk8-content2-monitoring](/wk8/wk8-content2-monitoring) | Structured logging, Health check, Alerting |
| เนื้อหา | [wk8-content3-slo-sla](/wk8/wk8-content3-slo-sla) | SLI/SLO/SLA, Error budget, MTTR |
| เนื้อหา | [wk8-content4-iac-intro](/wk8/wk8-content4-iac-intro) | IaC concepts, Terraform basics (อ่านออก) |
| เนื้อหา | [wk8-content5-incident-response](/wk8/wk8-content5-incident-response) | Runbook, On-call, Post-mortem, 5 Whys |
| เนื้อหา | [wk8-content6-documentation-code](/wk8/wk8-content6-documentation-code) | README standards, Runbook, ADR, Changelog |
| ใบงาน | [wk8-lab1-production](/wk8/wk8-lab1-production) | Deploy to Render + auto deploy pipeline |
| ใบงาน | [wk8-lab2-monitoring-setup](/wk8/wk8-lab2-monitoring-setup) | /health endpoint + UptimeRobot + Runbook |

**Ref Book:** Beyond the 12-Factor App · Terraform Up & Running Ch.1-2

---

### Module 9 — Final Project <Badge type="danger" text="สัปดาห์ 17–18 (สอบปลายภาค)" />

| ประเภท | ไฟล์ | หัวข้อ |
| :--- | :--- | :--- |
| เนื้อหา | [wk9-content1-devops-next](/wk9/wk9-content1-devops-next) | Kubernetes preview, SRE vs DevOps, Certifications |
| Project | [wk9-final-exam](/wk9/wk9-final-exam) | Full pipeline + Live URL + Presentation |

---

## 📊 สัดส่วนคะแนน

| หัวข้อ | คะแนน |
| :--- | :---: |
| คะแนนเก็บ (Lab wk1–wk4, wk6–wk8) | 40 |
| สอบกลางภาค (wk5 Midterm Project) | 20 |
| สอบปลายภาค (wk9 Final Project + Presentation) | 40 |
| **รวม** | **100** |

---

## 🛠️ Tech Stack ที่ใช้ในวิชา

::: code-group
```bash [Foundation]
Linux CLI (WSL2 on Windows) + Git Bash fallback
Bash Shell Script
Git + GitHub (Branch Protection + PR workflow)
```
```bash [Language & Runtime]
TypeScript + Node.js 20 LTS
Express.js (REST API)
ts-node (dev) → tsc + Multi-stage build (prod)
```
```bash [Container]
Docker Engine + Dockerfile
Docker Compose (healthcheck, depends_on)
GHCR — GitHub Container Registry
```
```bash [Automation & Quality]
GitHub Actions (CI/CD)
Jest + Supertest (Unit + Integration Test)
k6 (Performance Test)
ESLint + Prettier + Husky + lint-staged
Dependabot (auto dependency updates)
```
```bash [Deploy & Monitor]
Render (Cloud PaaS — free tier)
UptimeRobot (uptime monitoring)
12-Factor App methodology
Terraform (concept + read only)
```
:::

---

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
| Terraform Up and Running | M8 (concept) |
| Jenkins 2 Up and Running | อ้างอิงเปรียบเทียบ CI/CD tools |
