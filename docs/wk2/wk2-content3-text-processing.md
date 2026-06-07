# Text Processing — grep, sed, awk <Badge type="info" text="Module 2 · สัปดาห์ 3–4" />

> **Ref Book:** The Linux Command Line — Chapter 19–20


## 🔎 ทำไมต้องรู้ Text Processing?

Log files บน production มีหลายล้านบรรทัด — ค้นหาด้วยตาเปล่าไม่ได้

| คำสั่ง | ใช้ทำอะไร | ระดับ |
| :--- | :--- | :---: |
| **grep** | ค้นหา pattern / กรองบรรทัด | ✅ ต้องรู้ |
| **sed** | แก้ไข / แปลงข้อความ | 📘 Bonus |
| **awk** | ดึงคอลัมน์ / คำนวณข้อมูล | 📘 Bonus |

::: tip เน้น grep ก่อน — ใช้แล้วจริง 80% ของงาน
**grep** คือสิ่งที่ใช้ทุกวัน — ควรเรียนให้คล่องก่อนแล้วค่อย sed/awk ตอนมีเวลา
:::



## 🔍 grep — ค้นหา Pattern ใน Text

```bash
# รูปแบบพื้นฐาน
grep "PATTERN" file.txt

# ตัวอย่างจริง: ค้นหา ERROR ใน app.log
grep "ERROR" app.log
grep "ERROR" /var/log/app.log
```

### Options ที่ใช้บ่อย

```bash
# -n : แสดงเลขบรรทัด
grep -n "ERROR" app.log
# 42: [ERROR] Database connection failed
# 87: [ERROR] Timeout after 30s

# -i : case-insensitive (ไม่สนตัวพิมพ์เล็ก/ใหญ่)
grep -i "error" app.log   # จับ ERROR, Error, error ทั้งหมด

# -r : ค้นในทุกไฟล์ใน directory
grep -r "TODO" ./src/

# -l : แสดงแค่ชื่อไฟล์ที่มี match
grep -rl "console.log" ./src/

# -c : นับจำนวน match
grep -c "ERROR" app.log
# 47

# -v : แสดงบรรทัดที่ไม่ match (invert)
grep -v "INFO" app.log    # แสดงทุกบรรทัดยกเว้น INFO

# -A -B -C : แสดง context รอบๆ
grep -A 3 "FATAL" app.log   # แสดง 3 บรรทัดหลัง match
grep -B 2 "ERROR" app.log   # แสดง 2 บรรทัดก่อน match
grep -C 2 "ERROR" app.log   # แสดง 2 บรรทัดทั้งก่อนและหลัง
```

### grep กับ Regular Expression

```bash
# -E : Extended regex
grep -E "ERROR|WARN" app.log       # OR: ERROR หรือ WARN
grep -E "^2024-04" app.log         # บรรทัดที่ขึ้นต้นด้วย 2024-04
grep -E "\b4[0-9]{2}\b" access.log # HTTP 4xx status codes
grep -E "[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}" app.log  # IP

# ค้นหา line ว่างเปล่า และลบออก
grep -v "^$" config.txt
```


## ✂️ sed — แก้ไขข้อความ <Badge type="tip" text="📘 Bonus" />

::: tip ทางเลือก — ไม่ออกสอบ
`sed` เป็นทักษะที่ดีมากสำหรับสาย DevOps — แต่สำหรับ Module นี้ให้รู้จักไว้ก่อนก็พอ ไม่ต้องจำทุกคำสั่ง
:::

```bash
# รูปแบบพื้นฐาน
sed 's/OLD/NEW/g' file.txt

# s = substitute, g = global (แก้ทุก occurrence ในบรรทัด)
```

### ตัวอย่างการใช้งาน

```bash
# แทนที่คำ
sed 's/localhost/production.api.com/g' config.txt

# -i : แก้ไขล์ in-place (เปลี่ยนไฟล์จริง)
sed -i 's/PORT=3000/PORT=8080/g' .env

# ลบบรรทัดที่ตรงกับ pattern
sed '/^#/d' config.txt          # ลบ comment lines
sed '/^$/d' config.txt          # ลบบรรทัดว่าง

# แสดงเฉพาะบรรทัดที่กำหนด
sed -n '10,20p' app.log         # แสดงบรรทัด 10-20

# ใช้ใน pipeline
cat .env.example | sed 's/your-secret/'"$DB_PASSWORD"'/g' > .env
```

::: tip การใช้ sed กับ config files
```bash
# เปลี่ยน version ใน package.json อัตโนมัติ
NEW_VERSION="2.1.0"
sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json
```
:::


## 📊 awk — ดึงคอลัมน์ & วิเคราะห์ข้อมูล <Badge type="tip" text="📘 Bonus" />

::: tip ทางเลือก — ไม่ออกสอบ
`awk` เป็นคำสั่งที่ทรงพลังมาก แต่มี learning curve สูงกว่า grep — เรียนไว้บ้างเพื่ออ่านได้เมื่อเจอในงาน
:::

```bash
# รูปแบบพื้นฐาน: awk '{action}' file
# awk แบ่ง input เป็น fields โดย whitespace

echo "192.168.1.1 - GET /api/tasks 200 145ms"
# $1 = 192.168.1.1
# $2 = -
# $3 = GET
# $4 = /api/tasks
# $5 = 200
# $6 = 145ms
```

### ตัวอย่างจริง — วิเคราะห์ Access Log

```bash
# nginx access log format:
# 192.168.1.1 - - [17/Apr/2024:09:00:01] "GET /api/tasks HTTP/1.1" 200 1234

# ดึง IP address ทั้งหมด
awk '{print $1}' access.log

# ดึง HTTP status code (field ที่ 9)
awk '{print $9}' access.log

# ดึง IP + status code + response size
awk '{print $1, $9, $10}' access.log

# กรอง: แสดงเฉพาะ request ที่ status เป็น 500
awk '$9 == 500 {print $0}' access.log

# นับ request แยกตาม status code
awk '{count[$9]++} END {for (s in count) print s, count[s]}' access.log
# 200 9823
# 404 127
# 500 12
```

### awk กับ Field Separator

```bash
# -F : กำหนด field separator
awk -F: '{print $1}' /etc/passwd     # ดึง username จาก /etc/passwd
awk -F',' '{print $2}' data.csv      # ดึงคอลัมน์ 2 จาก CSV
awk -F'"' '{print $2}' access.log    # ดึงข้อมูลใน quotes

# ทำ condition + คำนวณ
awk '$9 >= 400 {errors++} END {print "Total errors:", errors}' access.log
```


## 🔗 รวม Pipeline — วิเคราะห์ log จริง

```bash
# 🏆 หา 5 IP ที่ request บ่อยสุด
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5
# 1234 192.168.1.100
#  567 10.0.0.5
#  ...

# 🔴 เฉพาะ error requests (4xx, 5xx)
grep -E '" [45][0-9][0-9] ' access.log | awk '{print $1, $9}' | sort | uniq -c

# 📊 นับ request แต่ละ endpoint
awk '{print $7}' access.log | sort | uniq -c | sort -rn | head -10

# ⏰ request volume แต่ละชั่วโมง
awk '{print $4}' access.log | cut -d: -f2 | sort | uniq -c
```


## 🧰 คำสั่งเสริม

```bash
# cut — ดึงคอลัมน์จาก delimited text
cut -d',' -f1,3 data.csv       # เอาคอลัมน์ 1 และ 3 จาก CSV
cut -d: -f1 /etc/passwd        # username เหมือน awk -F: '{print $1}'
echo "v20.1.0" | cut -d'.' -f1 # ได้ "v20"

# sort
sort file.txt                  # เรียง A-Z
sort -r file.txt               # เรียง Z-A
sort -n numbers.txt            # เรียงเป็นตัวเลข
sort -k3 -rn data.txt          # เรียงตาม field 3 ลดลง

# uniq
uniq file.txt                  # ลบบรรทัดซ้ำติดกัน (ต้อง sort ก่อน)
uniq -c file.txt               # นับจำนวนที่ซ้ำ
uniq -d file.txt               # แสดงเฉพาะที่ซ้ำ

# tr — แปลงตัวอักษร
echo "hello world" | tr 'a-z' 'A-Z'   # HELLO WORLD
echo "a:b:c" | tr ':' ','             # a,b,c
cat file.txt | tr -d '\r'             # ลบ Windows line endings
```


## 💡 สรุป

::: info 3 คำสั่งต้องจำ
| คำสั่ง | ใช้เมื่อ | pattern |
| :--- | :--- | :--- |
| **grep** | ค้นหาบรรทัด | `grep "pattern" file` |
| **sed** | แทนที่ข้อความ | `sed 's/old/new/g' file` |
| **awk** | ดึงคอลัมน์ / คำนวณ | `awk '{print $1}' file` |
:::

```bash
# สูตร pipeline วิเคราะห์ log
cat file.log | grep "ERROR" | awk '{print $1}' | sort | uniq -c | sort -rn | head -10
```

```mermaid
graph LR
    cat[cat file.log] -->|อ่านไฟล์| grep[grep ERROR]
    grep -->|กรองบรรทัด| awk[awk print $1]
    awk -->|ดึง IP| sort1[sort]
    sort1 -->|จัดกลุ่ม| uniq[uniq -c]
    uniq -->|นับจำนวน| sort2[sort -rn]
    sort2 -->|เรียงลำดับ| head[head -10]
    head -->|ผลลัพธ์ Top 10| Output[Terminal]
```


**← ก่อนหน้า:** [Shell Script](/wk2/wk2-content2-shell-script)  
**ถัดไป →** [Networking for DevOps](/wk2/wk2-content4-networking-devops)
