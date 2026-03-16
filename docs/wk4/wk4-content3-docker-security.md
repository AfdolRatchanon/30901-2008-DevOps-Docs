# Docker Security <Badge type="info" text="Module 4 · สัปดาห์ 7–8" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **Non-root user** — ทำไม container ไม่ควรรันเป็น root
  - เพิ่ม `USER node` ใน Dockerfile
- **.dockerignore** — ไฟล์ที่ไม่ควร copy เข้า image (`node_modules`, `.env`, `.git`)
- **Secrets ใน container** — ❌ อย่าใส่ใน Dockerfile, ✅ ใช้ environment variables
- **`npm audit`** — ตรวจ dependency vulnerability ใน 1 คำสั่ง
- **Image scanning เบื้องต้น** — Docker Scout (built-in Docker Desktop)
- **Minimal base image** — `node:20-alpine` เล็กกว่า `node:20` มาก

> เรียน 3 best practice — ทำได้ทันทีในทุก project

**Ref Book:** Docker Deep Dive 2025 — Chapter 16 (Security)
