# Incident Response <Badge type="info" text="Module 8 · สัปดาห์ 15–16" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **Incident** คืออะไร — ระบบล่ม, ช้าผิดปกติ, data หาย
- **Severity Level**: P1 (ระบบล่มทั้งหมด) → P4 (bug เล็กน้อย)
- **Runbook** — คู่มือ step-by-step สำหรับ on-call engineer
  - "ถ้า `/health` ตอบ 500 ให้ทำอะไรก่อน"
- **On-call rotation** — ทีม DevOps ผลัดเวรรับ alert
- **Incident timeline** — Detect → Respond → Resolve → Review
- **Post-mortem (Blameless)** — เรียนรู้จากเหตุการณ์โดยไม่โทษคน
  - 5 Whys technique
- นักเรียนเขียน runbook สำหรับ Task Tracker

> ถามทุก DevOps/SRE interview — "ถ้าระบบล่มตอนตี 2 คุณทำอะไร"

**Ref Book:** The DevOps Handbook — Part IV: Feedback Loops
