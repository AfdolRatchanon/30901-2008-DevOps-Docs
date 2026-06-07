# Lab 1: ตั้งค่า Dev Environment บน Windows <Badge type="tip" text="Module 1 · Lab 1" />

> **เป้าหมาย:** รัน `git --version`, `node --version`, `docker --version` ใน Git Bash หรือ Terminal ได้ครบ และ git รู้จักชื่อ-email ของคุณ ✅


## 📋 สิ่งที่ต้องทำ

1. ติดตั้ง Git สำหรับ Windows (พร้อม Git Bash)
2. ติดตั้ง VS Code + Extensions
3. ตั้งค่า Git พร้อมสร้าง SSH Key สำหรับ GitHub
4. ติดตั้ง Node.js (Windows Installer)
5. ติดตั้ง Docker Desktop
6. รัน verification script ยืนยันทุก tool พร้อม

## ⏱️ เวลาโดยประมาณ

| ขั้นตอน | เวลา |
| :--- | :---: |
| ติดตั้ง Git | 5 นาที |
| ติดตั้ง VS Code | 5 นาที |
| ตั้งค่า Git + SSH | 10 นาที |
| ติดตั้ง Node.js | 5 นาที |
| ติดตั้ง Docker Desktop | 10–15 นาที |
| **รวม** | **~40 นาที** |


## ขั้นตอนที่ 1 — ติดตั้ง Git (5 นาที)

**Git Bash** เป็น Terminal จำลองบน Windows ที่ทำให้เราสามารถใช้คำสั่ง Linux พื้นฐานได้ (เช่น `ls`, `cd`, `cat`) ซึ่งจำเป็นมากสำหรับการเรียนสาย DevOps

### 1.1 ดาวน์โหลดและติดตั้ง

1. ไปที่ [https://gitforwindows.org/](https://gitforwindows.org/) และกด **Download**
2. เปิดไฟล์ `.exe` ที่ดาวน์โหลดมา
3. ติดตั้งโดยกด **Next** ไปเรื่อย ๆ (ใช้ค่า Default ทั้งหมดได้เลย ปลอดภัยที่สุด)
4. เมื่อติดตั้งเสร็จ ให้ค้นหาโปรแกรม **Git Bash** ในเมนู Start ของ Windows และเปิดขึ้นมา

### 1.2 ตรวจสอบการติดตั้ง

ในหน้าจอ Git Bash ให้พิมพ์คำสั่งตามนี้ แล้วกด Enter:

```bash
git --version
```

ต้องเห็นรูปผลลัพธ์ประมาณนี้:
```
git version 2.x.x.windows.x
```

- [ ] เปิด `Git Bash` ได้สำเร็จ ✅
- [ ] `git --version` แสดง version ขึ้นมา ✅


## ขั้นตอนที่ 2 — ติดตั้ง VS Code (5 นาที)

### 2.1 ดาวน์โหลดและติดตั้ง

1. ไปที่ [https://code.visualstudio.com](https://code.visualstudio.com) → ดาวน์โหลด **Windows Installer**
2. รันโปรแกรมติดตั้ง (หากมีให้ติ๊ก ✅ **"Add to PATH"** กรุณาติ๊กด้วย)

### 2.2 ติดตั้ง Extensions

เปิด VS Code → กดปุ่ม Extension ด้านซ้าย (หรือ `Ctrl+Shift+X`) → ค้นหาและติดตั้งตัวต่อไปนี้:

| Extension | ID | ใช้ทำอะไร |
| :--- | :--- | :--- |
| **GitLens** | `eamodio.gitlens` | ดูประวัติของ code ว่าใครแก้ไขบรรทัดไหนบ้าง |
| **Docker** | `ms-azuretools.vscode-docker` | จัดการ Docker container จาก VS Code ได้ง่ายขึ้น |
| **ESLint** | `dbaeumer.vscode-eslint` | แสดง lint error ใน editor (ใช้ในสัปดาห์ถัดๆ ไป) |
| **Prettier** | `esbenp.prettier-vscode` | จัดรูปแบบ (format) code อัตโนมัติให้เป็นระเบียบ |

- [ ] ติดตั้ง VS Code สำเร็จ ✅
- [ ] ติดตั้ง Extensions พื้นฐานครบถ้วน ✅


## ขั้นตอนที่ 3 — ตั้งค่า Git + SSH Key (10 นาที)

เพื่อป้องกันปัญหาการระบุตัวตนเวลาส่งงาน และทำให้คุณสามารถดึง/ส่ง code ไปยัง GitHub ได้โดยไม่ต้องใส่รหัสผ่านตลอดเวลา

### 3.1 ตั้งค่าชื่อและอีเมล (ทำครั้งเดียว)

เปิด **Git Bash** แล้วรันคำสั่งเหล่านี้ (เปลี่ยนเป็นชื่อและอีเมลของคุณเอง):

```bash
# ตั้งค่าชื่อ
git config --global user.name "ชื่อ-นามสกุล ภาษาไทยหรืออังกฤษ"

# ตั้งค่าอีเมล (ใช้อีเมลเดียวกับที่สมัคร GitHub)
git config --global user.email "your.email@example.com"

# ตั้ง default branch เป็น main
git config --global init.defaultBranch main

# ตรวจสอบว่าตั้งค่าถูกต้องไหม
git config --list
```

### 3.2 สร้างและเชื่อมต่อ SSH Key ไปยัง GitHub

ในหน้าจอ **Git Bash** พิมพ์คำสั่งสร้างกุญแจความปลอดภัย:

```bash
# กด Enter ผ่านไปเรื่อย ๆ ได้เลย ไม่ต้องตั้งรหัสผ่านเพิ่ม (เพื่อความง่าย)
ssh-keygen -t ed25519 -C "your.email@example.com"
```

ดู public key ที่สร้างเสร็จ:
```bash
cat ~/.ssh/id_ed25519.pub
```

ผลลัพธ์จะแสดงข้อความยาวๆ เริ่มด้วย `ssh-ed25519 ...` **ให้คัดลอกข้อความยาวๆ นี้ทั้งหมด**

1. ไปที่ [GitHub.com](https://github.com) ล็อกอินให้เรียบร้อย
2. ไปที่มุมขวาบนคลิกรูปโปรไฟล์ → **Settings**
3. เมนูด้านซ้ายเลือก **SSH and GPG keys**
4. คลิกปุ่มสีเขียว **New SSH key**
5. ช่อง Title พิมพ์ชื่อเครื่องเช่น `My Windows Laptop`
6. ช่อง Key Type เลือก `Authentication Key`
7. วางระหัสข้อความยาวๆ ที่คัดลอกมาลงในช่อง **Key** แล้วกดปุ่ม Add

### 3.3 ทดสอบการเชื่อมต่อ GitHub

ใน **Git Bash**:
```bash
ssh -T git@github.com
```
(หากมีถาม yes/no ให้พิมพ์รหัส `yes` แล้วกด Enter)

ต้องเห็นข้อความทักทายจาก GitHub:
```
Hi your-username! You've successfully authenticated...
```

- [ ] `git config user.name` และ `email` ถูกตั้งค่าอย่างถูกต้อง ✅
- [ ] `ssh -T git@github.com` แสดงคำว่า "successfully authenticated" ✅


## ขั้นตอนที่ 4 — ติดตั้ง Node.js (5 นาที)

Node.js เป็น Runtime สภาพแวดล้อมสำหรับรัน JavaScript นอก Browser ซึ่งจำเป็นสำหรับวิชานี้

### 4.1 ดาวน์โหลด

1. ไปที่เว็บไซต์ [https://nodejs.org/](https://nodejs.org/)
2. เลือกดาวน์โหลดปุ่มสำหรับเวอร์ชัน **LTS (Long Term Support)** (เวอร์ชันปัจจุบันควรเป็นซีรีย์ 20.x หรือ 22.x)

### 4.2 ติดตั้ง

1. เปิดไฟล์ติดตั้ง `.msi` ที่โหลดมา
2. กด Next ตามปกติ
3. **ข้อควรระวัง:** ในหน้า Tools for Native Modules จะมีกรอบให้ติ๊ก *Automatically install the necessary tools. Note that this will also install Chocolatey...* แนะนำให้ **เว้นว่างเปล่าไว้ ไม่ต้องติ๊ก** เพื่อให้ติดตั้งเร็วและไม่กวนระบบคอมพิวเตอร์มาก

### 4.3 ตรวจสอบ

ปิด Git Bash ที่เปิดอยู่ก่อน แล้ว **เปิด Git Bash อันใหม่** เพื่อให้มันจับ Path ของ Node.js ได้อัปเดต แล้วพิมพ์คำสั่ง:

```bash
node --version
# ตัวอย่าง: v20.x.x

npm --version
# ตัวอย่าง: 10.x.x
```

- [ ] `node --version` แสดงเวอร์ชันของ Node.js ✅
- [ ] `npm --version` แสดงเวอร์ชันของ npm ✅


## ขั้นตอนที่ 5 — ติดตั้ง Docker Desktop (10–15 นาที)

Docker จะคอยจำลองระบบขนาดเล็ก ซึ่งจำเป็นต่อการจัดการแอปในกระบวนการ CI/CD

### 5.1 ดาวน์โหลด

1. ไปที่ [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. คลิกปุ่มดาวน์โหลดสำหรับ Windows

### 5.2 ติดตั้ง

1. กดรันโปรแกรมติดตั้ง
2. กรณีมีให้เลือกระหว่าง **Use WSL 2 instead of Hyper-V** ให้ **เปิดติ๊กถูกไว้ได้เลย** (Docker จะแอบรัน Linux engine ให้ในเบื้องหลัง โดยเราไม่ต้องเข้าไปยุ่งกับตัว Linux เลย)
3. กด Finish ระบบอาจจะให้ **Restart คอมพิวเตอร์** (กรุณา restart)

### 5.3 ยืนยันการทำงานของ Docker

เปิดแอป **Docker Desktop** ขึ้นมาเป็นครั้งแรก กดยอมรับเงื่อนไขต่าง ๆ และรอจนกว่าไอคอนสถานะที่มุมล่างซ้ายจะเป็นสีเขียว (Engines running)

จากนั้นเปิด **Git Bash** แล้วทดสอบ:

```bash
docker --version
# Docker version 27.x.x หริอใกล้เคียง

docker run hello-world
```

ถ้า Docker ดาวน์โหลดระบบเทสสำเร็จ จะแสดงข้อความร่ายยาว เริ่มด้วย:
```
Hello from Docker!
This message shows that your installation appears to be working correctly.
```

- [ ] ไอคอน Docker Desktop เปลี่ยนเป็นสีเขียว ✅
- [ ] `docker --version` โชว์เลขเวอร์ชัน ✅
- [ ] `docker run hello-world` ทำงานได้สำเร็จ ✅

### 5.4 ป้องกันคอมค้างด้วยการจำกัด RAM (สำคัญมาก!) ⭐

เนื่องจากระบบเบื้องหลังของ Docker (WSL2) มักจะดึง RAM เครื่องไปใช้จนหมด ทำให้คอมพิวเตอร์กระตุกหรือค้างได้ เพื่อป้องกันปัญหานี้ เราต้องสร้างไฟล์จำกัดการใช้ RAM:

1. เปิด **Git Bash** แล้วรันคำสั่งต่อไปนี้:

```bash
cat << 'EOF' > ~/.wslconfig
[wsl2]
memory=3GB
processors=2
EOF
```

2. จากนั้นรันคำสั่งเพื่อรีสตาร์ท WSL:
```bash
wsl --shutdown
```

*(ระบบ Docker Desktop อาจจะเด้งแจ้งเตือนว่าหยุดทำงาน ให้กดปุ่ม Restart ในหน้าต่าง Docker Desktop เพื่อให้ระบบเริ่มทำงานใหม่พร้อมกับขีดจำกัด RAM ที่เราตั้งไว้)*



## 🎯 Bonus Task (ถ้าเวลาเหลือ)

- [ ] ติดตั้ง Command line utility ให้คล้ายคลึง Linux มากขึ้นด้วย Scoop หรือ Chocolatey (สำหรับผู้สนใจ)
- [ ] ลองเข้าไปสร้าง Repository ใน GitHub เปล่าๆ แล้วลองใช้คำสั่ง `git clone` โหลดลงมาในเครื่องเพื่อทดสอบ Git


## 📤 ส่งงาน

ให้นักเรียนเปิดโปรแกรม **Git Bash** และคัดลอกคำสั่งด้านล่างไปวางแล้วกด Enter เพื่อทดสอบทุกอย่างรวดเดียว:

```bash
echo "=== Lab 1: Environment Check ===" && \
echo "นักเรียน: $(git config user.name)" && \
echo "Email: $(git config user.email)" && \
echo "" && \
git --version && \
node --version && \
npm --version && \
docker --version && \
echo "=== All checks passed! ==="
```

ต้องเห็นผลลัพธ์รูปคล้ายแบบนี้:
```
=== Lab 1: Environment Check ===
นักเรียน: สมชาย ใจดี
Email: somchai@example.com

git version 2.x.x.windows.x
v20.x.x
10.x.x
Docker version 27.x.x
=== All checks passed! ===
```

- [ ] ส่งในระบบการเรียนการสอน (LMS) โดยแนบ **Screenshot รูปถ่ายหน้าจอ** ของผลลัพธ์คำสั่งจาก Git Bash

::: tip 📝 เขียนสรุปสั้น ๆ ตอนส่งงาน
- มีปัญหาหาหรือติดขัดในขั้นตอนไหนบ้าง? และแก้ไขปัญหาได้อย่างไร?
- คิดว่า Git Bash ช่วยทำให้คำสั่งระบบรู้สึกคล้ายคลึงขึ้นจากพรอมพต์แบบ Windows ทั่วไปไหม?
:::


**← กลับไป:** [DORA Metrics](/wk1/wk1-content5-dora-metrics)
**Module ถัดไป →** [Module 2: Linux CLI](/wk2/wk2-content1-linux-cli)
