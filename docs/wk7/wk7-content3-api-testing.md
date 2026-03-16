# API Testing <Badge type="info" text="Module 7 · สัปดาห์ 13–14" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **Supertest** — ทดสอบ Express API โดยไม่ต้องรัน server จริง
- Integration Test vs Unit Test — ต่างกันอย่างไร ใช้เมื่อไหร่
- ทดสอบ HTTP response: status code, body, headers
- **Test fixtures** — ข้อมูล mock สำหรับ test ที่ consistent
- **Test isolation** — ทุก test ต้องไม่กระทบกัน
- Error case testing — ทดสอบ 404, 400, 500
- **GitHub Actions** — รัน integration test ใน CI พร้อม test report

> lab: ทดสอบ Task Tracker API ครบทุก endpoint ด้วย Supertest

**Ref Book:** Alice and Bob Learn Application Security — Chapter 3
