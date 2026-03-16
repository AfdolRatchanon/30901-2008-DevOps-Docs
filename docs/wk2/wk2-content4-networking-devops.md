# Networking for DevOps <Badge type="info" text="Module 2 · สัปดาห์ 3–4" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **IP + Port** — ทำไม `localhost:3000` ถึงทำงานได้
- **DNS** — domain name แปลงเป็น IP ได้อย่างไร (`dig`, `nslookup`)
- **HTTP vs HTTPS** — ต่างกันอย่างไร, ทำไม production ต้องใช้ HTTPS
- **SSL/TLS Certificate** — คืออะไร, ได้มาจากไหน (Let's Encrypt ฟรี)
- **curl** — ทดสอบ API endpoint จาก terminal
  - `curl -X GET`, `-X POST`, `-H`, `-d`
- **ping + traceroute** — debug network ขั้นพื้นฐาน
- **Port ที่ DevOps ต้องรู้**: 22 (SSH), 80 (HTTP), 443 (HTTPS), 3000, 5432, 6379

> เรียนผ่าน diagram + คำสั่ง — ไม่ต้องตั้ง server เอง

**Ref Book:** The Linux Command Line — Chapter 16
