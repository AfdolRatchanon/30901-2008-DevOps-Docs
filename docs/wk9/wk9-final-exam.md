# Final Exam <Badge type="danger" text="Module 9 · สัปดาห์ 17–18" />

## สิ่งที่ต้องส่ง

::: tip โปรเจกต์ที่ต้องส่ง: Task Tracker — Full DevOps Pipeline
ส่ง GitHub Repository + URL ที่เปิดได้จริง + นำเสนอต่อหน้าชั้นเรียน
:::

## Checklist ก่อนส่ง

### Code & Repository
- [ ] App รัน local ได้ (`docker compose up`)
- [ ] มี `README.md` อธิบาย architecture + วิธีรัน
- [ ] Git commit history มีความหมายตลอด project

### CI/CD Pipeline
- [ ] `.github/workflows/ci.yml` รันอัตโนมัติเมื่อ push
- [ ] Pipeline: Build → Lint → Test → Push Image → Deploy
- [ ] Secrets ไม่อยู่ใน code (ใช้ GitHub Secrets)

### Testing & Quality
- [ ] มี Unit Test สำหรับ API ≥ 3 test cases
- [ ] Test coverage report แสดงใน pipeline
- [ ] ESLint pass โดยไม่มี error

### Deployment
- [ ] App deploy บน cloud — เปิดได้จาก public URL
- [ ] มี `GET /health` endpoint
- [ ] Environment variables ตั้งใน cloud platform (ไม่ใช่ใน code)

---

## เกณฑ์การให้คะแนน (40 คะแนน)

| เกณฑ์ | คะแนน |
| :--- | :---: |
| App ทำงานได้บน cloud (CRUD ครบ) | 8 |
| CI/CD pipeline ครบทุก stage | 10 |
| Testing + coverage ≥ 60% | 8 |
| Code quality (ESLint + security) | 4 |
| Monitoring / health check | 4 |
| นำเสนอและตอบ Code Review ได้ | 6 |
| **รวม** | **40** |

---

## แนวทางการนำเสนอ (10 นาที)

1. **Demo** — เปิด URL จริง แสดงให้เห็นว่า app ทำงานได้
2. **Pipeline walkthrough** — อธิบาย workflow ทีละ stage
3. **Code Review** — ตอบคำถามจากครู/เพื่อน (เน้น "ทำไม")
