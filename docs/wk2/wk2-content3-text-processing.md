# Text Processing <Badge type="info" text="Module 2 · สัปดาห์ 3–4" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- `grep` — หาข้อความใน log file (เน้นใช้งานจริง)
  - `grep "ERROR" app.log`
  - `grep -n`, `-i`, `-r`, `-E` (regex)
- `sed` — แก้ข้อความใน file โดยไม่ต้องเปิด editor
  - `sed 's/old/new/g'`
- `awk` — ดึงคอลัมน์เฉพาะออกมา
  - `awk '{print $1, $4}'` ดึง IP + timestamp จาก access.log
- `cut`, `sort`, `uniq` — วิเคราะห์ข้อมูลซ้ำ
- `wc -l` — นับบรรทัด error
- pipe ทุกอย่างเข้าด้วยกัน: `grep | awk | sort | uniq -c`

> เรียนแค่ 3 คำสั่งหลัก: `grep`, `sed`, `awk` — ใช้ได้จริง 80% ของงาน

**Ref Book:** The Linux Command Line — Chapter 19-20
