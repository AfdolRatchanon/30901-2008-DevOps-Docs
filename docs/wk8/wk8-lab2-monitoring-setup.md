# Lab: Monitoring Setup <Badge type="tip" text="Module 8 · Lab 2" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- เพิ่ม `GET /health` endpoint ที่คืน JSON status ครบ:
  ```json
  { "status": "ok", "uptime": 3600, "version": "1.0.0" }
  ```
- ตั้ง UptimeRobot monitor ฟรี (ping ทุก 5 นาที)
- เชื่อม alert กับ email — รับ notification ทันที app ล่ม
- เขียน runbook 1 หน้าสำหรับ Task Tracker:
  - ถ้า `/health` ตอบ 500 ให้ทำอะไร
  - ถ้า container restart loop ให้ดู log อะไร
- ทดสอบ: หยุด app แล้วดูว่า UptimeRobot ส่ง alert มาไหม ✅

**เป้าหมาย:** ระบบแจ้งเตือนอัตโนมัติเมื่อ app มีปัญหา + มี runbook พร้อมใช้ ✅
