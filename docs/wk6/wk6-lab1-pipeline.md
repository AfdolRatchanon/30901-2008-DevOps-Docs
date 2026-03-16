# Lab: Build Pipeline <Badge type="tip" text="Module 6 · Lab 1" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- สร้าง `.github/workflows/ci.yml` ใน repo Task Tracker
- Pipeline ต้องทำงานอัตโนมัติเมื่อ push ไปที่ `main`
- Steps: Checkout → Setup Node → Install → Build → Test
- เพิ่ม step: Build Docker image + Push ไปที่ Docker Hub
- ใช้ GitHub Secrets เก็บ `DOCKERHUB_USERNAME` และ `DOCKERHUB_TOKEN`
- ทดสอบว่า push ครั้งต่อไป pipeline รันและ pass ✅

**เป้าหมาย:** `git push` แล้วเห็น green checkmark ใน GitHub Actions ✅
