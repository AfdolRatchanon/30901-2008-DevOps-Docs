# Lab: Containerize App <Badge type="tip" text="Module 4 · Lab 1" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- เขียน `Dockerfile` สำหรับ Task Tracker backend (Node.js/Express)
- เขียน `Dockerfile` สำหรับ frontend (Nginx + static files)
- สร้าง `docker-compose.yml` รัน backend + frontend พร้อมกัน
- ทดสอบ `docker compose up --build` แล้วเปิด browser ดูผล
- Push image ขึ้น Docker Hub

**เป้าหมาย:** `docker compose up` แล้ว app ทำงานได้บน `http://localhost:3000` ✅
