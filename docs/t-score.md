# แผนการประเมินผล T-Score <Badge type="info" text="30901-2008" />

**รายวิชา:** 30901-2008 การพัฒนาซอฟต์แวร์รูปแบบเดฟออฟส์  
**ภาคเรียนที่:** 1/2569


## 📊 ตารางคะแนน

| คะแนน | รายละเอียดงาน | คะแนนที่ได้ | ผลงาน |
| :--- | :--- | :---: | :--- |
| **T1-1** | ติดตั้งโปรแกรมต่างๆ (Git, Node.js, Docker Desktop) | 5 | Screenshot แสดงผล `git --version`, `node --version`, `docker --version` ใน Git Bash / Terminal |
| **T1-2** | เขียน Shell Script และวิเคราะห์ Log ไฟล์ | 5 | ไฟล์ `.sh` script อัตโนมัติ + ผลวิเคราะห์ log ด้วย grep/sed/awk |
| **T2-1** | ทำงานเป็นทีมด้วย Branch, Pull Request และ Code Review | 5 | PR history บน GitHub + Branch Protection Rules + Comment review ที่ผ่านแล้ว |
| **T2-2** | บรรจุแอปลงใน Docker และ publish ขึ้น GHCR | 5 | `Dockerfile` + `docker-compose.yml` พร้อม healthcheck + Image URL บน GHCR |
| **Mid** | Project ประจำวิชา | 20 | GitHub repo Task Tracker ครบ — README, Git history, Dockerfile, ทุก Milestone M1–M4 |
| **T3-1** | สร้าง CI/CD Pipeline Build → Test → Deploy อัตโนมัติ | 5 | GitHub Actions workflow file + README badge แสดงสถานะ CI ✅ |
| **T3-2** | เขียน Unit Test และตั้งค่า Quality Gate ใน CI | 5 | Test files (Jest + Supertest) + Coverage Report ≥ 60% + CI pipeline ผ่าน |
| **T4** | บูรณาการ | 10 | ระบบครบวงจร: CI/CD + Test + Deploy + Monitoring ทำงานร่วมกันได้บน repository เดียว |
| **T5** | Deploy แอปขึ้น Production และตั้งค่า Monitoring | 10 | Live URL บน Render + `/health` endpoint + UptimeRobot dashboard + `RUNBOOK.md` |
| **Final** | สอบปฏิบัติปลายภาค 1/2569 | 20 | Full pipeline demo + นำเสนอ DORA Metrics ของโปรเจกต์ตัวเองพร้อม Live URL |
| **จิตพิสัย** | พฤติกรรม+มาเรียน | 10 | บันทึกการเข้าเรียน + ส่งงานตรงเวลา + มีส่วนร่วมในชั้นเรียน |
| | **รวมคะแนน** | **100** | |


## 🗓️ ตารางกำหนดส่งงาน

| คะแนน | Module | สัปดาห์ | กำหนดส่ง |
| :--- | :--- | :---: | :--- |
| T1-1 | M1 — DevOps Foundation | 1–2 | ปลาย wk2 |
| T1-2 | M2 — Linux & Shell Script | 3–4 | ปลาย wk4 |
| T2-1 | M3 — Git & GitHub | 5–6 | ปลาย wk6 |
| T2-2 | M4 — Docker & Cloud | 7–8 | ปลาย wk8 |
| **Midterm** | M5 — Midterm Project | **9** | **วันสอบกลางภาค** |
| T3-1 | M6 — GitHub Actions CI/CD | 10–12 | ปลาย wk12 |
| T3-2 | M7 — Testing & Quality | 13–14 | ปลาย wk14 |
| T4 | M8 — Deploy & Monitor | 15–16 | ปลาย wk16 |
| T5 | M8 — Production + Monitoring | 15–16 | ปลาย wk16 |
| **Final** | M9 — Final Project | **17–18** | **วันสอบปลายภาค** |


## 📁 Milestone Map — โปรเจกต์ Task Tracker

สิ่งที่โปรเจกต์ต้องมีในแต่ละจุดส่ง:

::: tip Project Milestone Map
| จบ Module | โปรเจกต์ต้องมี |
| :--- | :--- |
| **T1-1** | Repo สร้างแล้ว + README + folder structure ชัดเจน |
| **T1-2** | Shell script ตั้งค่า environment อัตโนมัติ |
| **T2-1** | Git history สะอาด + Conventional Commits + PR workflow |
| **T2-2** | `Dockerfile` + `docker-compose.yml` รัน local ได้สมบูรณ์ |
| **Midterm** | ทุกอย่างข้างบนรวมกัน — ครบและทำงานได้จริง |
| **T3-1** | GitHub Actions: CI pipeline รัน test ทุก push + push image to GHCR |
| **T3-2** | Unit test + Integration test + Coverage ≥ 60% ผ่านใน CI |
| **T4** | ระบบทุกส่วนทำงานกันครบ end-to-end บน pipeline เดียว |
| **T5** | Live URL + `/health` endpoint + Monitoring dashboard + Runbook |
| **Final** | Full DevOps pipeline + Presentation พร้อม DORA Metrics |
:::


## 📐 เกณฑ์การให้คะแนน (T1–T5)

::: info แต่ละ Lab จะประเมินตาม 3 มิติ
| มิติ | สัดส่วน | หัวข้อ |
| :--- | :---: | :--- |
| **ความถูกต้อง** | 50% | งานทำงานได้จริง ไม่มี error |
| **ความครบถ้วน** | 30% | ทุก requirement ครบตามใบงาน |
| **คุณภาพ** | 20% | code สะอาด, มี comment, README อ่านเข้าใจง่าย |
:::


## 🔗 ลิงก์ที่เกี่ยวข้อง

- [Course Outline](/course-outline) — ภาพรวมรายวิชาทั้งหมด
- [Lab wk1: ติดตั้ง Dev Environment](/wk1/wk1-lab1-env-setup) → T1-1
- [Lab wk2: Automation Script](/wk2/wk2-lab1-automation) → T1-2
- [Lab wk3: Team Workflow](/wk3/wk3-lab1-team-workflow) → T2-1
- [Lab wk4: Containerize App](/wk4/wk4-lab1-containerize) → T2-2
- [Midterm Exam](/wk5/wk5-midterm-exam) → Mid
- [Lab wk6: CI/CD Pipeline](/wk6/wk6-lab1-pipeline) → T3-1
- [Lab wk7: Test in Pipeline](/wk7/wk7-lab1-test-pipeline) → T3-2
- [Lab wk8: Go Production](/wk8/wk8-lab1-production) → T4 & T5
- [Final Exam](/wk9/wk9-final-exam) → Final
