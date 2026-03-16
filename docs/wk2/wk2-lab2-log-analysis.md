# Lab: Log Analysis <Badge type="tip" text="Module 2 · Lab 2" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- รับ log file จริงจาก Docker container (Task Tracker)
- ใช้ `grep` หา error ทั้งหมด
- ใช้ `awk` ดึง timestamp + HTTP status code
- ใช้ `sort | uniq -c | sort -rn` หา error ที่เกิดบ่อยที่สุด
- เขียน shell script `analyze-log.sh` ที่รายงานสรุป 3 อย่าง:
  - จำนวน error ทั้งหมด
  - 5 error ที่เกิดบ่อยสุด
  - ช่วงเวลาที่มี request มากสุด

**เป้าหมาย:** รัน `./analyze-log.sh app.log` แล้วได้ report ออกมา ✅
