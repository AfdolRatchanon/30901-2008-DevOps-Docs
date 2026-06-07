# Lab 1: Automation Script <Badge type="tip" text="Module 2 · Lab 1" />

> **เป้าหมาย:** รัน `./setup.sh my-project` แล้วได้ folder structure พร้อมใช้งานภายใน 1 คำสั่ง


## 📋 สิ่งที่ต้องทำ

1. เขียน Shell Script `setup.sh` สร้าง project structure อัตโนมัติ
2. เขียน `health-check.sh` ตรวจสอบว่า dev tools พร้อมใช้ครบ
3. เพิ่ม cron job รัน health-check ทุกวัน


## ขั้นตอนที่ 1 — สร้าง Project Setup Script

สร้างไฟล์ `setup.sh` ใน home directory:

```bash
touch ~/setup.sh
chmod +x ~/setup.sh
code ~/setup.sh
```

### เนื้อหาของ `setup.sh`

```bash
#!/bin/bash
set -eu

# ─── Config ────────────────────────────────────────────────
PROJECT_NAME=${1:-""}
AUTHOR_NAME=$(git config user.name 2>/dev/null || echo "unknown")

# ─── Helper Functions ──────────────────────────────────────
log_info()    { echo "  ✅ $1"; }
log_warn()    { echo "  ⚠️  $1"; }
log_error()   { echo "  ❌ $1" >&2; }
log_section() { echo ""; echo "── $1 ──────────────────────────"; }

check_tool() {
  if command -v "$1" &> /dev/null; then
    log_info "$1 ($(command -v "$1"))"
    return 0
  else
    log_error "$1 ยังไม่ได้ติดตั้ง"
    return 1
  fi
}

# ─── Validate Input ────────────────────────────────────────
if [ -z "$PROJECT_NAME" ]; then
  echo "Usage: $0 <project-name>"
  echo "  ตัวอย่าง: $0 task-tracker"
  exit 1
fi

if [ -d "$PROJECT_NAME" ]; then
  log_error "directory '$PROJECT_NAME' มีอยู่แล้ว"
  exit 1
fi

# ─── Check Dependencies ────────────────────────────────────
log_section "ตรวจสอบ tools"
check_tool "git"
check_tool "node"
check_tool "npm"

# ─── Create Project Structure ──────────────────────────────
log_section "สร้างโปรเจกต์: $PROJECT_NAME"

mkdir -p "$PROJECT_NAME"/{src/{routes,middleware},tests,docs}

# README.md
cat > "$PROJECT_NAME/README.md" << EOF
# $PROJECT_NAME

> สร้างโดย $AUTHOR_NAME วัน $(date +%Y-%m-%d)

## 🚀 Quick Start

\`\`\`bash
npm install
npm run dev
\`\`\`

## 📁 Project Structure

\`\`\`
$PROJECT_NAME/
├── src/
│   ├── routes/
│   └── middleware/
├── tests/
├── docs/
├── .env.example
├── .gitignore
└── README.md
\`\`\`
EOF

# .env.example
cat > "$PROJECT_NAME/.env.example" << 'EOF'
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_NAME=app_db
JWT_SECRET=your-secret-key-here
EOF

# .gitignore
cat > "$PROJECT_NAME/.gitignore" << 'EOF'
node_modules/
.env
dist/
*.log
.DS_Store
EOF

# git init
cd "$PROJECT_NAME"
git init
git add .
git commit -m "feat: initial project setup by setup.sh"

log_section "เสร็จสิ้น!"
echo ""
echo "  📁 โปรเจกต์พร้อมแล้วที่: ./$PROJECT_NAME"
echo "  👉 ต่อไป: cd $PROJECT_NAME && npm init -y"
```


## ขั้นตอนที่ 2 — ทดสอบ setup.sh

```bash
# รัน script
./setup.sh task-tracker

# ตรวจสอบผลลัพธ์
ls -la task-tracker/
find task-tracker/ -type f  # แสดงไฟล์ทั้งหมดที่สร้างขึ้นมา

# ดู git log
cd task-tracker && git log --oneline
```

ผลลัพธ์ที่คาดหวัง:
```
── ตรวจสอบ tools ──────────────────────────
  ✅ git (/usr/bin/git)
  ✅ node (/c/Program Files/nodejs/node)
  ✅ npm (/c/Program Files/nodejs/npm)

── สร้างโปรเจกต์: task-tracker ───────────

── เสร็จสิ้น! ─────────────────────────────

  📁 โปรเจกต์พร้อมแล้วที่: ./task-tracker
  👉 ต่อไป: cd task-tracker && npm init -y
```

::: warning ⚠️ หมายเหตุโปรเจกต์ Task Tracker 
โปรเจกต์ที่เราให้สคริปต์สร้างขึ้นมาใน Lab สัปดาห์นี้ เป็นเพียง **"แบบฝึกหัดการเขียน Shell Script"** เท่านั้นครับ 
เมื่อเข้าสู่สัปดาห์ที่ 3 เราจะไม่ใช้โฟลเดอร์นี้ทำงานต่อ แต่จะนำ Source Code ตัวเต็มที่ครูเตรียมโครงสร้างไว้หมดแล้ว (เรียกว่า `starter`) มาปั้นเป็น CI/CD Pipeline ของจริงแทนครับ
:::


## ขั้นตอนที่ 3 — สร้าง Health Check Script

```bash
touch ~/health-check.sh
chmod +x ~/health-check.sh
```

```bash
#!/bin/bash
# health-check.sh — ตรวจสอบว่า dev environment พร้อมใช้งาน

LOG_DIR="$HOME/.devops-logs"
LOG_FILE="$LOG_DIR/health-$(date +%Y%m%d).log"
mkdir -p "$LOG_DIR"

PASS=0
FAIL=0

check() {
  local NAME=$1
  local CMD=$2
  local MIN_VER=${3:-""}

  if eval "$CMD" &>/dev/null; then
    echo "✅ $NAME: $(eval "$CMD" 2>&1 | head -1)"
    PASS=$((PASS + 1))
  else
    echo "❌ $NAME: ไม่พบหรือรันไม่ได้"
    FAIL=$((FAIL + 1))
  fi
}

echo "========================================"
echo " Dev Environment Health Check"
echo " $(date '+%Y-%m-%d %H:%M:%S')"
echo "========================================"

check "Git"     "git --version"
check "Node.js" "node --version"
check "npm"     "npm --version"
check "Docker"  "docker --version"
check "curl"    "curl --version"

echo "----------------------------------------"
echo " ผ่าน: $PASS  ❌ ไม่ผ่าน: $FAIL"
echo "========================================"

# บันทึก log
{
  echo "=== $(date) ==="
  echo "PASS=$PASS FAIL=$FAIL"
} >> "$LOG_FILE"

# exit code ตาม result
[ $FAIL -eq 0 ] && exit 0 || exit 1
```

ทดสอบ:
```bash
./health-check.sh
```


## ขั้นตอนที่ 4 — ระบบตั้งเวลาอัตโนมัติ (Cron Job vs Task Scheduler)

> **สำหรับผู้ใช้ Linux / Mac:**
ในระบบปฏิบัติการ Linux จะมีบริการที่เรียกว่า `Cron` สำหรับรันสคริปต์อัตโนมัติตามเวลาที่กำหนด 
```bash
crontab -e
# ตัวอย่าง: รัน script ทุกวันตอน 8 โมงเช้า
# 0 8 * * * /home/devops/health-check.sh >> /home/devops/.devops-logs/cron.log 2>&1
```

> **สำหรับผู้ใช้ Windows (ตัวเราในห้องเรียนนี้!):**
บน Windows เราไม่ได้ใช้ Cron แต่จะใช้เครื่องมือที่ชื่อ **Task Scheduler** ซึ่งเป็นโปรแกรมแบบ GUI ในการกำหนดเวลาแทน
เราแค่ให้ความรู้ไว้เป็นเกร็ดนะครับ ไม่จำเป็นต้องตั้งค่าระบบ Task Scheduler บนเครื่องให้สคริปต์ทำงานทุกวันจริงๆ ใน Lab นี้

::: info รูปแบบ Cron Expression (ความรู้เพิ่มเติมสำหรับ DevOps)
แม้เราจะอยู่บน Windows แต่ชาว DevOps ต้องอ่าน Cron Format ให้ออกครับ:
```
* * * * * command
│ │ │ │ │
│ │ │ │ └── day of week (0=Sun, 7=Sun)
│ │ │ └──── month (1-12)
│ │ └────── day of month (1-31)
│ └──────── hour (0-23)
└────────── minute (0-59)
```
| Expression | ความหมาย |
| :--- | :--- |
| `0 8 * * *` | ทุกวัน เวลา 08:00 |
| `*/5 * * * *` | ทุก 5 นาที |
| `0 0 * * 1` | ทุกวันจันทร์ เที่ยงคืน |
:::


## ✅ ส่งงาน Lab 1

รัน script ทั้งหมดและ capture output:

```bash
# 1. รัน setup script
./setup.sh task-tracker

# 2. แสดงโครงสร้างที่สร้างได้
find task-tracker/ -type f

# 3. แสดง git log
cd task-tracker && git log --oneline

# 4. รัน health check
~/health-check.sh
```

ส่ง: **Screenshot** หรือ **screen recording** ที่แสดงทั้ง 4 ขั้นตอนผ่าน + **ไฟล์ `setup.sh` และ `health-check.sh`**


**← ก่อนหน้า:** [Networking for DevOps](/wk2/wk2-content4-networking-devops)  
**ถัดไป →** [Lab 2: Log Analysis](/wk2/wk2-lab2-log-analysis)
