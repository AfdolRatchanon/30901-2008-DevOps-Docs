# Infrastructure as Code (IaC) <Badge type="info" text="Module 8 · สัปดาห์ 15–16" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **IaC คืออะไร** — สร้าง server ด้วย code แทนคลิก UI
- ปัญหาก่อนมี IaC: "ไม่รู้ว่า server ตั้งค่าอะไรไว้บ้าง"
- **Terraform** — tool IaC ที่ใช้มากที่สุด (มีหนังสือใน Ref Book)
  - HCL syntax เบื้องต้น (อ่านออก ไม่ต้องเขียนเก่ง)
  - `terraform init`, `plan`, `apply`, `destroy`
  - ดู demo: สร้าง cloud server ด้วยโค้ด 20 บรรทัด
- **Declarative vs Imperative** — บอก "ต้องการอะไร" แทน "ทำอย่างไร"
- ทำไม IaC ถึงเป็นหัวใจของ DevOps สมัยใหม่

> เรียนแบบ concept + อ่าน code — ไม่ต้องเขียน Terraform project เอง

**Ref Book:** Terraform Up and Running — Chapter 1-2
