# Advanced GitHub Actions <Badge type="info" text="Module 6 · สัปดาห์ 10–12" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- Secrets & Environment Variables — เก็บ credentials อย่างปลอดภัย
- Environments: `staging`, `production` พร้อม protection rules
- Matrix Strategy: test บน Node.js หลาย version พร้อมกัน
- Reusable Workflows: แยก workflow แล้วเรียกซ้ำ
- Caching: `actions/cache` เพื่อเร่ง build
- Artifacts: เก็บ output ของ job ไว้ดาวน์โหลด
- Deployment workflow: build → push image → deploy

**Ref Book:** Learning GitHub Actions — Chapter 5-9
