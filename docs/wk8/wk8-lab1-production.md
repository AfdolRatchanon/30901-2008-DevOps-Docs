# Lab: Go Production <Badge type="tip" text="Module 8 · Lab 1" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- สร้าง account บน Render (หรือ Railway)
- เชื่อม GitHub repo เข้ากับ Render — auto deploy ทุกครั้งที่ merge to main
- ตั้งค่า Environment Variables บน Render dashboard
- เพิ่ม `GET /health` endpoint ใน Task Tracker API
- ตั้ง Uptime Monitor ฟรีผ่าน UptimeRobot
- เพิ่ม deploy step ใน GitHub Actions pipeline
- ทดสอบ: push code → pipeline รัน → Render deploy อัตโนมัติ ✅

**เป้าหมาย:** เปิด URL สาธารณะ แล้ว Task Tracker ทำงานได้จริงบน internet ✅
