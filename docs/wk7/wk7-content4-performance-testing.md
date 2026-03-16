# Performance Testing <Badge type="info" text="Module 7 · สัปดาห์ 13–14" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## หัวข้อที่จะเรียนในบทนี้

- **ทำไม Performance Test ถึงสำคัญ** — deploy แล้ว user แห่เข้ามา app ค้างทันที
- **k6** — load testing tool เขียนด้วย JavaScript เรียนง่ายมาก
  - script 10 บรรทัดรัน 100 concurrent users ได้
- **ตัวชี้วัด**: RPS (requests/sec), P95 latency, error rate
- **Threshold** — กำหนดว่า "pass" คือ P95 < 200ms error rate < 1%
- เพิ่ม performance test ใน CI pipeline (รันก่อน deploy)
- อ่านผล k6 report — เห็นว่า bottleneck อยู่ที่ไหน

> k6 script เขียนเป็น JavaScript — นักเรียนเขียนได้ทันที

**Ref Book:** The DevOps Handbook — Part IV: The Second Way (Feedback)
