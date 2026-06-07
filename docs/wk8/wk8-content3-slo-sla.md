# SLI / SLO / SLA — Service Level <Badge type="info" text="Module 8 · สัปดาห์ 15–16" />

> **Ref Book:** The DevOps Handbook — Part IV: Feedback


## 📏 3 คำศัพท์ที่ต้องรู้

| ย่อ | เต็ม | คือ |
| :---: | :--- | :--- |
| **SLI** | Service Level Indicator | ตัวเลขที่วัดได้จริง |
| **SLO** | Service Level Objective | เป้าหมายที่ทีมตั้งไว้ |
| **SLA** | Service Level Agreement | สัญญากับลูกค้า |


## 🔢 SLI — ตัวเลขที่วัดได้จริง

**SLI** คือตัวชี้วัดที่วัดจากระบบจริง เช่น:

```
Availability SLI:
  requests_success / requests_total = 9,950 / 10,000 = 99.5%

Latency SLI:
  requests_under_200ms / total_requests = 9,800 / 10,000 = 98%

Error Rate SLI:
  error_requests / total_requests = 50 / 10,000 = 0.5%
```

SLI ที่ดีสำหรับ API:

| SLI | วัดอะไร | สูตร |
| :--- | :--- | :--- |
| **Availability** | % ของเวลาที่ระบบรันอยู่ | uptime / total time |
| **Error Rate** | % ของ request ที่ fail | errors / total requests |
| **Latency P95** | response time ที่ 95th percentile | — |
| **Throughput** | request ที่รับได้/วินาที | RPS |


## 🎯 SLO — เป้าหมายของทีม

**SLO** คือเป้าหมายที่ทีม DevOps ตั้งไว้สำหรับ SLI แต่ละตัว

```
ตัวอย่าง SLO สำหรับ Task Tracker:
  Availability ≥ 99.5%     (ล่มได้ไม่เกิน 0.5% ของเวลา)
  P95 Latency < 200ms      (95% ของ request ตอบเร็วกว่า 200ms)
  Error Rate < 0.1%         (error น้อยกว่า 1 ใน 1,000 request)
```

### SLO ≠ 100%

::: info ทำไมไม่ตั้ง SLO 100%?
- ไม่มีระบบใดรับประกัน 100% ได้จริง
- การตั้งเป้า 100% ทำให้กลัวการ deploy → deploy ช้า → feature ช้า
- ใช้ Error Budget แทน — มีพื้นที่สำหรับ deploy และ maintenance
:::


## 💰 Error Budget — งบประมาณสำหรับ Error

**Error Budget** = เวลาที่ระบบล่มได้โดยยัง meet SLO

```
SLO: Availability ≥ 99.9%  →  Error Budget = 0.1%
คำนวณ:
  ต่อปี   = 365 × 24 × 60 × 0.001 = 525.6 นาที (~8.7 ชั่วโมง)
  ต่อเดือน = 30 × 24 × 60 × 0.001 = 43.2 นาที
  ต่อสัปดาห์ = 7 × 24 × 60 × 0.001 = 10.1 นาที
```

### ตาราง Availability Nines

| Availability | Downtime ต่อปี | Downtime ต่อเดือน |
| :---: | :--- | :--- |
| 99% ("two nines") | 87.6 ชั่วโมง | 7.2 ชั่วโมง |
| 99.9% ("three nines") | 8.7 ชั่วโมง | 43 นาที |
| 99.95% | 4.4 ชั่วโมง | 21 นาที |
| 99.99% ("four nines") | 52 นาที | 4.3 นาที |

::: tip Task Tracker SLO ที่เหมาะสม
สำหรับ learning project: **99.5% availability**  
= ล่มได้ ~43.8 ชั่วโมงต่อปี → สบายมาก แต่ฝึกนิสัยดี
:::


## 📜 SLA — สัญญากับลูกค้า

**SLA** คือ SLO ที่กลายเป็นสัญญาทางกฎหมายหรือธุรกิจกับลูกค้า

```
SLA ของ Google Workspace:
  "Uptime ≥ 99.9% ต่อเดือน
   ถ้าไม่ถึงลูกค้าได้รับ Service Credit"

SLA ของ AWS EC2:
  "Monthly Uptime ≥ 99.99%
   ถ้า 99.0–99.99% → คืน 10% ของ monthly bill
   ถ้า < 99.0% → คืน 30%"
```

| | SLO | SLA |
| :--- | :--- | :--- |
| **ใคร** | ทีม DevOps ตั้งเอง | สัญญากับลูกค้า |
| **ผลถ้าไม่ผ่าน** | ต้องแก้ไข | ต้องจ่าย penalty |
| **เข้มงวด** | น้อยกว่า SLA | มากกว่า SLO |
| **SLO vs SLA** | SLO ≥ SLA เสมอ | — |


## 🔗 ความสัมพันธ์กับ DORA Metrics

| DORA Metric | ความสัมพันธ์กับ SLO/Error Budget |
| :--- | :--- |
| **Deployment Frequency** | deploy บ่อย = ใช้ error budget เร็ว แต่ fix เร็วด้วย |
| **Change Failure Rate** | ลด CFR = error budget เหลือมากขึ้น |
| **MTTR** | MTTR สั้น = ใช้ error budget น้อย |
| **Lead Time** | lead time สั้น = แก้ bug ได้เร็วก่อน budget หมด |


## 📊 คำนวณ Error Budget ของตัวเอง

```
Task Tracker Error Budget Calculator:

SLO: 99.5% availability
ระยะเวลา: 30 วัน

Total minutes = 30 × 24 × 60 = 43,200 นาที
Error Budget   = 43,200 × (100% - 99.5%) = 43,200 × 0.005 = 216 นาที

เหลือ: 216 นาที (~3.6 ชั่วโมง) ต่อเดือน

ถ้า Render cold start ใช้เวลา 30 วินาที → deploy ได้สูงสุด 432 ครั้ง/เดือน
ก่อนจะ breach SLA!
```


## 💡 สรุป

::: info SLI / SLO / SLA สรุปสั้น
```
SLI = "ตอนนี้ระบบทำงานได้ 99.7%"  (วัดจริง)
SLO = "เป้าหมาย ≥ 99.5%"           (ทีมตั้ง)
SLA = "รับประกัน ≥ 99%"             (สัญญากับลูกค้า)
Error Budget = 0.5% × เวลา = เวลาที่ล่มได้ตาม SLO
```
:::


**← ก่อนหน้า:** [Monitoring & Logging](/wk8/wk8-content2-monitoring)  
**ถัดไป →** [Infrastructure as Code](/wk8/wk8-content4-iac-intro)
