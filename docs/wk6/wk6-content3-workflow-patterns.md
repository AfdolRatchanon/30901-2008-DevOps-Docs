# Deployment Workflow Patterns <Badge type="info" text="Module 6 · สัปดาห์ 10–12" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **Rolling Deployment** — อัปเดตทีละตัว ไม่ downtime (เหมาะเริ่มต้น)
- **Blue-Green Deployment** — มี 2 environment สลับกัน rollback ได้ทันที
- **Canary Deployment** — ปล่อย version ใหม่ให้ user 5% ก่อน
- เปรียบเทียบ: ความเสี่ยง, ค่าใช้จ่าย, ความซับซ้อน
- **Rollback Strategy** — ถ้า deploy แล้วพัง ทำอะไรทันที (ถามทุก interview)
- GitHub Actions: สร้าง environment `staging` และ `production` แยกกัน

> เรียนแบบ concept + diagram — lab จะทำใน wk6-lab2

**Ref Book:** The DevOps Handbook — Part III: Technical Practices
