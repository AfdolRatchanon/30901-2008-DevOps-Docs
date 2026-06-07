# Lab 2: Log Analysis <Badge type="tip" text="Module 2 · Lab 2" />

> **เป้าหมาย:** รัน `./analyze-log.sh app.log` แล้วได้รายงานสรุป error พร้อมสถิติ ✅


## 📋 สิ่งที่ต้องทำ

1. เตรียม log file ตัวอย่าง (simulate server log)
2. วิเคราะห์ด้วย grep / awk / sort / uniq ทีละขั้น
3. รวมเป็น script `analyze-log.sh` ที่รายงาน 3 อย่าง:
   - จำนวน error ทั้งหมด
   - 5 error ที่เกิดบ่อยสุด
   - ช่วงเวลาที่มี request มากสุด


## ขั้นตอนที่ 1 — สร้าง Log File ตัวอย่าง

```bash
# สร้าง sample log ด้วย script นี้
cat > generate-log.sh << 'EOF'
#!/bin/bash
# สร้าง nginx-style access log สำหรับฝึก

LOG_FILE="app.log"
STATUSES=(200 200 200 200 200 201 301 400 401 403 404 404 500 502 503)
PATHS=("/api/tasks" "/api/tasks/1" "/api/users" "/health" "/api/login" "/api/tasks/99" "/unknown")
IPS=("192.168.1.10" "192.168.1.20" "10.0.0.5" "172.16.0.100" "203.185.52.1")

> "$LOG_FILE"  # clear file

for i in $(seq 1 500); do
  IP="${IPS[$RANDOM % ${#IPS[@]}]}"
  STATUS="${STATUSES[$RANDOM % ${#STATUSES[@]}]}"
  PATH_="${PATHS[$RANDOM % ${#PATHS[@]}]}"
  HOUR=$(printf "%02d" $((RANDOM % 24)))
  MIN=$(printf "%02d" $((RANDOM % 60)))
  SEC=$(printf "%02d" $((RANDOM % 60)))
  SIZE=$((RANDOM % 5000 + 100))

  echo "$IP - - [17/Apr/2025:${HOUR}:${MIN}:${SEC} +0700] \"GET ${PATH_} HTTP/1.1\" $STATUS $SIZE" >> "$LOG_FILE"
done

echo "สร้าง $LOG_FILE แล้ว ($(wc -l < "$LOG_FILE") บรรทัด)"
EOF

chmod +x generate-log.sh
./generate-log.sh
```

ดู log ที่ได้:
```bash
head -5 app.log
# 192.168.1.10 - - [17/Apr/2025:14:23:01 +0700] "GET /api/tasks HTTP/1.1" 200 1234
# 10.0.0.5 - - [17/Apr/2025:08:55:33 +0700] "GET /api/tasks/99 HTTP/1.1" 404 256
# ...
```


## ขั้นตอนที่ 2 — วิเคราะห์ทีละขั้น (ฝึกมือ)

ทำความเข้าใจ log format ก่อน:

```
192.168.1.10 - - [17/Apr/2025:14:23:01] "GET /api/tasks HTTP/1.1" 200 1234
     $1                   $4                        $7             $9   $10
     IP              timestamp                     path         status  size
```

### 2.1 นับ request ทั้งหมด

```bash
wc -l app.log
```

### 2.2 หา Error ทั้งหมด (4xx & 5xx)

```bash
# วิธี 1: ใช้ grep + regex
grep -E '" [45][0-9][0-9] ' app.log

# วิธี 2: ใช้ awk
awk '$9 >= 400 {print $0}' app.log

# นับจำนวน
grep -cE '" [45][0-9][0-9] ' app.log
```

### 2.3 สถิติแต่ละ Status Code

```bash
awk '{print $9}' app.log | sort | uniq -c | sort -rn
# นับจำนวน request แต่ละ status code
```

### 2.4 หา 5 IP ที่ Error บ่อยสุด

```bash
awk '$9 >= 400 {print $1}' app.log | sort | uniq -c | sort -rn | head -5
```

### 2.5 Request Volume แต่ละชั่วโมง

```bash
# ดึง hour จาก timestamp (format: [17/Apr/2025:14:23:01])
awk '{print $4}' app.log | cut -d: -f2 | sort | uniq -c
```

### 2.6 5 Endpoint ที่ถูกเรียกบ่อยสุด

```bash
awk '{print $7}' app.log | sort | uniq -c | sort -rn | head -5
```


## ขั้นตอนที่ 3 — เขียน `analyze-log.sh`

```bash
touch analyze-log.sh
chmod +x analyze-log.sh
```

```bash
#!/bin/bash
set -eu

# ─── Config ─────────────────────────────────────────────────
LOG_FILE=${1:-"app.log"}

# ─── Validate ────────────────────────────────────────────────
if [ ! -f "$LOG_FILE" ]; then
  echo "❌ ไม่พบไฟล์: $LOG_FILE"
  echo "Usage: $0 <log-file>"
  exit 1
fi

# ─── Helper ──────────────────────────────────────────────────
section() { echo ""; echo "════════════════════════════════════"; echo "  $1"; echo "════════════════════════════════════"; }

# ─── Main Report ─────────────────────────────────────────────
echo ""
echo "╔═══════════════════════════════════════╗"
echo "║       LOG ANALYSIS REPORT             ║"
echo "║  ไฟล์: $LOG_FILE"
echo "║  วันที่: $(date '+%Y-%m-%d %H:%M:%S')"
echo "╚═══════════════════════════════════════╝"

TOTAL=$(wc -l < "$LOG_FILE")
# กรองบรรทัดที่ status code ($9) >= 400 แล้วนับบรรทัด
ERRORS=$(awk '$9 >= 400' "$LOG_FILE" | wc -l)
# กรองบรรทัดที่ status code ($9) < 400 แล้วนับบรรทัด
SUCCESS=$(awk '$9 < 400' "$LOG_FILE" | wc -l)
# ใช้ awk คำนวณเปอร์เซ็นต์ทศนิยม 1 ตำแหน่ง
ERROR_RATE=$(awk "BEGIN {printf \"%.1f\", ($ERRORS/$TOTAL)*100}")

# ─── 1. Overview ─────────────────────────────────────────────
section "📊 ภาพรวม"
echo "  Request ทั้งหมด : $TOTAL"
echo "  สำเร็จ (2xx/3xx): $SUCCESS"
echo "  Error (4xx/5xx) : $ERRORS"
echo "  Error Rate       : ${ERROR_RATE}%"

# ─── 2. Status Code Breakdown ────────────────────────────────
section "📋 สรุปตาม Status Code"
# ดึง column ที่ 9 (status code) -> จัดกลุ่ม -> นับจำนวน -> เรียงจากมากไปน้อย -> จัด format ให้สวยงาม
awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn | \
  awk '{printf "  %-6s requests: %s\n", $2, $1}'

# ─── 3. Top 5 Errors ─────────────────────────────────────────
section "🔴 Top 5 Error ที่เกิดบ่อยสุด"
# กรองเฉพาะ error ($9 >= 400) -> ดึง path ($7) และ status ($9) -> นับและเรียงลำดับ -> เอาแค่ 5 อันดับแรก
awk '$9 >= 400 {print $7, $9}' "$LOG_FILE" | \
  sort | uniq -c | sort -rn | head -5 | \
  awk '{printf "  %3dx  [%s] %s\n", $1, $3, $2}'

# ─── 4. Top 5 IPs with Errors ───────────────────────────────
section "🌐 Top 5 IP ที่เกิด Error บ่อยสุด"
# กรองเฉพาะ error ($9 >= 400) -> ดึง IP ($1) -> นับและเรียงลำดับ -> เอาแค่ 5 อันดับแรก
awk '$9 >= 400 {print $1}' "$LOG_FILE" | \
  sort | uniq -c | sort -rn | head -5 | \
  awk '{printf "  %4d errors  from %s\n", $1, $2}'

# ─── 5. Peak Hours ───────────────────────────────────────────
section "⏰ ชั่วโมงที่มี Request มากสุด (Top 5)"
# ดึง timestamp ($4) -> ตัดเอาเฉพาะหลักชั่วโมงด้วย cut -> นับและเรียงลำดับ -> เอาแค่ 5 อันดับแรก
awk '{print $4}' "$LOG_FILE" | cut -d: -f2 | \
  sort | uniq -c | sort -rn | head -5 | \
  awk '{printf "  %02d:00 น.  —  %4d requests\n", $2, $1}'

echo ""
echo "════════════════════════════════════"
echo "  ✅ วิเคราะห์เสร็จสิ้น"
echo "════════════════════════════════════"
echo ""
```


## ขั้นตอนที่ 4 — ทดสอบ Script

```bash
./analyze-log.sh app.log
```

ตัวอย่างผลลัพธ์:
```
╔═══════════════════════════════════════╗
║       LOG ANALYSIS REPORT             ║
║  ไฟล์: app.log
║  วันที่: 2025-04-17 14:30:00
╚═══════════════════════════════════════╝

════════════════════════════════════
  📊 ภาพรวม
════════════════════════════════════
  Request ทั้งหมด : 500
  สำเร็จ (2xx/3xx): 382
  Error (4xx/5xx) : 118
  Error Rate       : 23.6%

════════════════════════════════════
  📋 สรุปตาม Status Code
════════════════════════════════════
  200    requests: 310
  404    requests: 78
  500    requests: 25
  ...

════════════════════════════════════
  🔴 Top 5 Error ที่เกิดบ่อยสุด
════════════════════════════════════
   34x  [404] /api/tasks/99
   18x  [500] /api/tasks
   ...

════════════════════════════════════
  ⏰ ชั่วโมงที่มี Request มากสุด (Top 5)
════════════════════════════════════
  14:00 น.  —    52 requests
  09:00 น.  —    48 requests
  ...
```


## ✅ ส่งงาน Lab 2

```bash
# รันคำสั่งเหล่านี้แล้ว capture output
./generate-log.sh
./analyze-log.sh app.log
```

ส่ง:
1. **Screenshot** ผลลัพธ์ของ `analyze-log.sh` ที่ครบทั้ง 3 ส่วน (ภาพรวม, Top errors, Peak hours)
2. **ไฟล์ `analyze-log.sh`** อัพโหลดใน GitHub repository

::: tip Bonus Challenge (เพิ่มคะแนน)
เพิ่ม flag `--watch` ให้ script วิเคราะห์ log แบบ real-time:
```bash
./analyze-log.sh app.log --watch
```
:::


**← ก่อนหน้า:** [Lab 1: Automation Script](/wk2/wk2-lab1-automation)  
**Module ถัดไป →** [Module 3: Git Fundamentals](/wk3/wk3-content1-git-basics)
