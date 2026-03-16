# Lab: Compose Advanced <Badge type="tip" text="Module 4 · Lab 2" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- เปิด `docker-compose.yml` ของ Task Tracker ที่ทำใน Lab 1
- เพิ่ม `healthcheck` ใน backend service:
  ```yaml
  healthcheck:
    test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
    interval: 30s
    timeout: 10s
    retries: 3
  ```
- เพิ่ม `depends_on` ให้ frontend รอ backend healthy ก่อนเริ่ม
- สร้าง `docker-compose.override.yml` สำหรับ dev mode (mount source code)
- ทดสอบ: หยุด backend แล้วดู health status เปลี่ยนเป็น unhealthy ✅

**เป้าหมาย:** `docker compose ps` แสดง `(healthy)` สำหรับทุก service ✅
