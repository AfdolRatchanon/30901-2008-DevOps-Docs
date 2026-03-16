# Secrets Management <Badge type="info" text="Module 6 · สัปดาห์ 10–12" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **ทำไม Secrets ถึงสำคัญมาก** — API key หลุดใน GitHub = ค่าใช้จ่ายหลักล้าน (เรื่องจริง)
- ❌ Anti-pattern: hardcode ใน code, commit `.env` ขึ้น GitHub
- ✅ Pattern ที่ถูก:
  - `.env` สำหรับ local development + อยู่ใน `.gitignore`
  - GitHub Secrets สำหรับ CI/CD pipeline
  - Cloud platform env vars สำหรับ production
- **Secret scanning** — GitHub alert ถ้าเผลอ commit secret
- **Dependabot** — auto สร้าง PR อัปเดต dependency ที่มี CVE (ตั้งใน 1 ไฟล์)
- **Rotation** — เปลี่ยน secret เป็นประจำ — ทำไมและทำอย่างไร

> เรียนผ่าน ✅ ❌ เปรียบเทียบ — ทำผิดแบบไหนและแก้อย่างไร

**Ref Book:** Alice and Bob Learn Application Security — Chapter 5
