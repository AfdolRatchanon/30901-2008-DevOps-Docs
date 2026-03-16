# Lab: Multi-Environment Pipeline <Badge type="tip" text="Module 6 · Lab 2" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- แยก workflow เป็น 2 ไฟล์:
  - `ci.yml` — รันทุก branch (build + test)
  - `deploy.yml` — รันเฉพาะ merge to `main` (deploy to production)
- สร้าง GitHub Environment `production` พร้อม protection rule (require review)
- เพิ่ม README badge แสดง CI status:
  ```markdown
  ![CI](https://github.com/USER/REPO/actions/workflows/ci.yml/badge.svg)
  ```
- ทดสอบ: push ไป feature branch → CI รัน / merge to main → Deploy รัน ✅

**เป้าหมาย:** badge สีเขียวบน README + pipeline แยก env ชัดเจน ✅
