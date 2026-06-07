# Linux CLI — Navigation, Files & Permissions <Badge type="info" text="Module 2 · สัปดาห์ 3–4" />

> **Ref Book:** The Linux Command Line — Chapter 1–9


## 🐧 ทำไม DevOps ต้องรู้ Linux CLI?

Server จริงบน production แทบทุกที่รัน **Linux** และไม่มี GUI — ทุกการกระทำทำผ่าน terminal

```bash
# สิ่งที่ DevOps ทำผ่าน CLI ทุกวัน
ssh user@server          # เชื่อมต่อ server
cat /var/log/app.log     # อ่าน log
chmod 755 deploy.sh      # ปรับ permission
ps aux | grep node       # ดู process
```

::: tip เป้าหมายของ Module นี้
ไม่ต้องจำทุกคำสั่ง — เน้นจำ **pattern** และรู้ว่าเมื่อไรใช้อะไร
:::


## 📁 Linux File System

Linux มีโครงสร้างแบบ **Tree** เริ่มจาก root `/`

```
/
├── home/          ← home directory ของ user แต่ละคน (~)
│   └── devops/
├── etc/           ← config files ของระบบ (nginx.conf, hosts)
├── var/           ← ข้อมูลที่เปลี่ยนแปลง เช่น log files
│   └── log/
├── tmp/           ← ไฟล์ชั่วคราว (ลบเมื่อ reboot)
├── usr/           ← โปรแกรมที่ติดตั้ง
│   └── local/bin/
├── bin/           ← คำสั่งพื้นฐาน (ls, cp, mv)
└── proc/          ← ข้อมูล process ที่รันอยู่ (virtual)
```

| Directory | ใช้ทำอะไร | ตัวอย่าง |
| :--- | :--- | :--- |
| `/home/user` | personal files | code, downloads |
| `/etc` | system config | `/etc/nginx/nginx.conf` |
| `/var/log` | log files | `/var/log/syslog` |
| `/tmp` | temp files | build artifacts ชั่วคราว |
| `/usr/local/bin` | installed programs | node, git, docker |


## 🧭 Navigation — เดินทางใน File System

```bash
# รู้ว่าตอนนี้อยู่ที่ไหน
pwd
# /home/devops

# ดูรายการไฟล์
ls               # แสดงชื่อ
ls -l            # แสดง details (permission, size, date)
ls -la           # รวม hidden files (ที่ขึ้นต้นด้วย .)
ls -lh           # แสดง size แบบ human-readable (KB, MB)

# เปลี่ยน directory
cd /var/log      # ไปที่ absolute path
cd ..            # ขึ้นหนึ่งระดับ
cd ~             # กลับ home
cd -             # กลับ directory ก่อนหน้า

# ดูโครงสร้าง tree
tree             # ต้องติดตั้งก่อน: sudo apt install tree
tree -L 2        # แสดงแค่ 2 ระดับ
```


## 📄 File Operations — จัดการไฟล์

```bash
# สร้าง
touch app.log           # สร้างไฟล์เปล่า
mkdir src               # สร้าง directory
mkdir -p src/routes/v1  # สร้าง nested directory

# อ่าน
cat README.md           # แสดงทั้งไฟล์
less app.log            # อ่านทีละหน้า (q = ออก)
head -20 app.log        # แสดง 20 บรรทัดแรก
tail -50 app.log        # แสดง 50 บรรทัดสุดท้าย
tail -f app.log         # real-time: ดู log ที่กำลัง write

# คัดลอก ย้าย ลบ
cp file.txt backup.txt      # copy
cp -r src/ src-backup/      # copy directory (recursive)
mv old-name.txt new-name.txt # rename / move
rm file.txt                 # ลบไฟล์
rm -rf build/               # ลบ directory ทั้งหมด (ระวัง!)
```

::: warning `rm -rf` อันตรายมาก
ไม่มี "Trash" ใน Linux CLI — ลบแล้วหายเลย  
ก่อนรัน `rm -rf` ให้รัน `ls` ดูก่อนเสมอ
:::


## 🔐 Permissions — rwx

Linux ทุกไฟล์มี permission 3 ชุด:

```bash
ls -la
# -rwxr-xr-- 1 devops devops 1234 Apr 17 09:00 deploy.sh
#  ↑↑↑↑↑↑↑↑↑
#  │└──┴──┴──── group (r-x) = อ่าน+รัน
#  │   └──┴──── others (r--) = อ่านอย่างเดียว
#  └── owner (rwx) = อ่าน+เขียน+รัน
```

| Symbol | ความหมาย | ค่าตัวเลข |
| :---: | :--- | :---: |
| `r` | read — อ่านได้ | 4 |
| `w` | write — เขียน/แก้ได้ | 2 |
| `x` | execute — รันได้ | 1 |
| `-` | ไม่มีสิทธิ์ | 0 |

```bash
# เปลี่ยน permission
chmod 755 deploy.sh    # rwxr-xr-x (owner=7, group=5, others=5)
chmod +x deploy.sh     # เพิ่ม execute ให้ทุกคน
chmod 600 .env         # rw------- (เฉพาะ owner อ่าน/เขียน)

# เปลี่ยน owner
chown devops:devops file.txt
chown -R devops:devops /app/  # recursive
```

::: tip Permission ที่ใช้บ่อยใน DevOps
| Pattern | ใช้กับอะไร |
| :---: | :--- |
| `755` | script ที่ทุกคนรันได้ |
| `644` | config file ทั่วไป |
| `600` | `.env` หรือ private key — ห้าม group/others อ่าน |
| `700` | directory ส่วนตัว |
:::


## ⚙️ Process Management

```bash
# ดู process ที่รันอยู่
ps aux              # แสดง process ทั้งหมด
ps aux | grep node  # filter หา node process
top                 # real-time process monitor (q = ออก)
htop                # top แบบสวยกว่า (ต้องติดตั้ง)

# หยุด process
kill 1234           # ส่ง SIGTERM (graceful) โดยใช้ PID
kill -9 1234        # ส่ง SIGKILL (force) — ใช้เมื่อ process ค้าง
pkill node          # kill process ที่ชื่อ node ทั้งหมด

# รัน background
node server.js &        # รันใน background, ได้ PID กลับมา
jobs                    # ดู background jobs
fg %1                   # เรียก job 1 กลับมา foreground
nohup node server.js &  # รัน background แม้ terminal ปิด
```


## 🔀 Redirection & Pipes — เชื่อมคำสั่ง

```bash
# Redirection — เปลี่ยนทิศทาง output
echo "hello" > file.txt    # เขียนทับ
echo "world" >> file.txt   # ต่อท้าย (append)
cat < file.txt             # อ่านจาก file แทน keyboard
node server.js 2> error.log  # redirect error ไปที่ file

# Pipe — ส่ง output ของคำสั่งหนึ่งเป็น input ของอีกคำสั่ง
cat app.log | grep "ERROR"             # หา ERROR ใน log
cat app.log | grep "ERROR" | wc -l    # นับจำนวน error
ls -la | sort -k5 -rn                  # เรียง file ตาม size

# คำสั่งที่ใช้คู่กับ pipe บ่อย
wc -l file.txt         # นับจำนวนบรรทัด
sort file.txt          # เรียงข้อความ
uniq                   # ลบบรรทัดซ้ำ
head -10               # เอาแค่ 10 บรรทัดแรก
tail -10               # เอาแค่ 10 บรรทัดสุดท้าย
```

### ตัวอย่าง Pipeline จริง

```bash
# หา 5 IP ที่ request บ่อยสุดใน access.log
cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5
```


## 🔍 ค้นหาไฟล์

```bash
# find — ค้นหาไฟล์ใน filesystem
find /var/log -name "*.log"           # หาไฟล์ .log ทั้งหมด
find . -name "*.ts" -type f           # หาไฟล์ .ts ใน directory ปัจจุบัน
find . -mtime -1                      # ไฟล์ที่แก้ไขภายใน 24 ชั่วโมง
find /tmp -size +100M                 # ไฟล์ใหญ่กว่า 100MB ใน /tmp

# which — หาว่า program อยู่ที่ไหน
which node    # /usr/local/bin/node
which git     # /usr/bin/git
```


## 💡 สรุป

::: info คำสั่งที่ต้องจำให้ได้ก่อนเรียน Module ถัดไป
```bash
pwd / ls -la / cd       # Navigate
cat / less / tail -f    # อ่านไฟล์
cp / mv / rm -rf        # จัดการไฟล์
chmod 755 / chown       # Permissions
ps aux / kill           # Process
| / > / >>              # Pipe & Redirect
```
:::


**← Module ก่อนหน้า:** [Lab ตั้งค่า Environment](/wk1/wk1-lab1-env-setup)  
**ถัดไป →** [Shell Script — Variables, Loops, Functions](/wk2/wk2-content2-shell-script)
