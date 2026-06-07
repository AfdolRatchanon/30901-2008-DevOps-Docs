# Performance Testing with k6 <Badge type="info" text="Module 7 · สัปดาห์ 13–14" />

> **Ref Book:** The DevOps Handbook — Part IV: The Second Way (Feedback)


## ⚡ ทำไม Performance Test ถึงสำคัญ?

สถานการณ์จริง: deploy app ที่ทุกคนทดสอบว่าทำงานได้ — แล้วเปิดตัว user แห่เข้า 1,000 คนพร้อมกัน

```
ผลลัพธ์ที่ไม่มี Performance Test:
  Response time: 30ms → 5,000ms  ← user เห็น "loading..."
  Error rate: 0% → 45%           ← request timeout
  Server CPU: 5% → 99%           ← ระบบค้าง
```

Performance Test ช่วยให้รู้ก่อน production ว่า **app รับ load ได้แค่ไหน**


## 🔧 k6 — Load Testing Tool

**k6** คือ load testing tool ที่เขียน script ด้วย JavaScript — นักเรียนเขียนได้ทันที

### ติดตั้ง k6

```bash
# Windows (WSL2)
sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update && sudo apt-get install k6

# macOS
brew install k6

# ตรวจสอบ
k6 version
```


## 📝 Script พื้นฐาน

```javascript
// load-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

// ─── Options ───────────────────────────────────────────────
export const options = {
  vus: 10,               // virtual users (concurrent users)
  duration: '30s',       // รัน 30 วินาที
}

// ─── Test ──────────────────────────────────────────────────
export default function () {
  const res = http.get('http://localhost:3000/api/tasks')

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 200ms': (r) => r.timings.duration < 200,
    'response has data': (r) => JSON.parse(r.body).data !== undefined,
  })

  sleep(1)                // รอ 1 วินาทีก่อน request ถัดไป
}
```

รัน:

```bash
k6 run load-test.js

# Output
# ✓ status is 200
# ✓ response time < 200ms
# ✓ response has data
#
# checks: 100.00% ✓ 300 ✗ 0
# http_req_duration: avg=45ms  min=12ms  med=38ms  max=215ms  p(90)=89ms  p(95)=112ms
# http_reqs: 297/s
```


## 📊 ตัวชี้วัดสำคัญ

| ตัวชี้วัด | ย่อว่า | ความหมาย |
| :--- | :--- | :--- |
| **Requests Per Second** | RPS | app รับ request ได้กี่ครั้ง/วินาที |
| **Response Time P95** | P95 | 95% ของ request ตอบภายในเวลานี้ |
| **Response Time P99** | P99 | 99% ของ request ตอบภายในเวลานี้ |
| **Error Rate** | — | % ของ request ที่ fail |
| **Virtual Users** | VUs | จำนวน user จำลองที่รันพร้อมกัน |

::: info เกณฑ์ที่ดีสำหรับ Task Tracker API
- P95 Response time < **200ms**
- Error rate < **1%**
- รับได้ > **50 RPS** ที่ 10 concurrent users
:::


## 🎯 Threshold — กำหนด Pass/Fail

```javascript
// load-test-with-threshold.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,
  duration: '30s',
  thresholds: {
    // ถ้าไม่ผ่าน threshold → k6 exit code 1 → CI pipeline fail
    'http_req_duration': ['p(95)<200'],   // P95 ต้องน้อยกว่า 200ms
    'http_req_failed': ['rate<0.01'],      // error rate ต้องน้อยกว่า 1%
    'checks': ['rate>0.99'],              // checks ต้องผ่าน 99%+
  },
}

export default function () {
  const res = http.get('http://localhost:3000/api/tasks')
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time OK': (r) => r.timings.duration < 200,
  })
  sleep(1)
}
```


## 📈 Stages — Ramp up & Ramp down

```javascript
// load-test-stages.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  stages: [
    { duration: '10s', target: 5 },    // ramp up: 0→5 users ใน 10 วิ
    { duration: '30s', target: 10 },   // peak: 10 users นาน 30 วิ
    { duration: '10s', target: 50 },   // stress: 10→50 users
    { duration: '10s', target: 0 },    // ramp down: กลับ 0
  ],
  thresholds: {
    'http_req_duration': ['p(95)<500'],  // ยืดหยุ่นขึ้นเล็กน้อย
    'http_req_failed': ['rate<0.05'],    // error < 5%
  },
}

export default function () {
  const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000'

  // ทดสอบหลาย endpoint สลับกัน
  const responses = http.batch([
    ['GET', `${BASE_URL}/api/tasks`],
    ['GET', `${BASE_URL}/health`],
  ])

  responses.forEach(res => {
    check(res, { 'status 200': (r) => r.status === 200 })
  })

  sleep(1)
}
```


## 🔄 k6 ใน CI Pipeline

```yaml
# .github/workflows/ci.yml — เพิ่ม performance test step
jobs:
  test:
    steps:
      # ... unit tests ...

  performance:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js (start app)
        uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }

      - run: npm ci && npm run build

      - name: Start app in background
        run: |
          node dist/index.js &
          sleep 5             # รอให้ app start
          curl http://localhost:3000/health

      - name: Install k6
        run: |
          sudo apt-get install gnupg2 -y
          sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg \
            --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
          echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" \
            | sudo tee /etc/apt/sources.list.d/k6.list
          sudo apt-get update && sudo apt-get install k6

      - name: Run performance test
        run: k6 run --out json=results.json load-test.js

      - name: Upload k6 results
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: k6-results
          path: results.json
```


## 📖 อ่าน k6 Summary

```
scenarios: (100.00%) 1 scenario, 10 max VUs, 1m0s max duration
default: 10 looping VUs for 30s

✓ status is 200
✓ response time < 200ms

checks.........................: 100.00% ✓ 280 ✗ 0
data_received..................: 45 kB   1.5 kB/s
http_req_blocked...............: avg=1.5ms  min=1µs    med=4µs
http_req_duration..............: avg=42ms   min=11ms   med=35ms   p(90)=78ms   p(95)=98ms
  ✓ { expected_response:true }.: avg=42ms   min=11ms   med=35ms   p(95)=98ms
http_req_failed................: 0.00%   ✓ 0 ✗ 280
http_reqs......................: 280     9.33/s
```

::: tip อ่าน P95 ให้เป็น
`p(95)=98ms` แปลว่า "95% ของ request ทั้งหมดตอบสนองภายใน 98ms"  
→ ผ่าน threshold P95 < 200ms ✅
:::


## 💡 สรุป

::: info k6 commands ที่ต้องจำ
```bash
k6 run script.js                      # รัน test พื้นฐาน
k6 run --vus 50 --duration 1m script.js  # 50 users นาน 1 นาที
k6 run -e BASE_URL=https://staging.app.com script.js  # ส่ง env var
k6 run --out json=results.json script.js  # export ผลลัพธ์
```
:::


**← ก่อนหน้า:** [SIT / Integration Testing](/wk7/wk7-content3-sit-integration)  
**ถัดไป →** [Lab: Test in Pipeline](/wk7/wk7-lab1-test-pipeline)
