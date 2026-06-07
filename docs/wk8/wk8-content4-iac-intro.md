# Infrastructure as Code — IaC & Terraform <Badge type="info" text="Module 8 · สัปดาห์ 15–16" />

> **Ref Book:** Terraform Up and Running — Chapter 1–2

::: tip 📖 เนื้อหานี้คือ "รู้จักไว้" — ไม่ต้องทำจริงใน course นี้
Course นี้ deploy บน **Render** ซึ่งไม่ต้องการ Terraform  
อ่านเพื่อ **เข้าใจแนวคิด IaC** และรู้ว่า DevOps ระดับ production จัดการ infrastructure อย่างไร  
Lab ปฏิบัติยังคงเป็น Render + GitHub Actions ตามเดิม
:::

## 🏗️ IaC คืออะไร?

**Infrastructure as Code (IaC)** คือการสร้างและจัดการ infrastructure (server, network, database) ด้วย **code** แทนการคลิก UI ด้วยมือ

### ปัญหาก่อนมี IaC

```
ทีม Ops ต้องการ server ใหม่:
  1. เปิด AWS Console
  2. คลิกตั้งค่า 30+ options
  3. จดไว้ใน spreadsheet
  4. ทีมอื่นทำซ้ำขั้นตอนเดิม (แต่ผิดขั้นตอนนึง)
  5. 6 เดือนต่อมา: "server นี้ตั้งค่าอะไรไว้บ้างนะ?"
  6. ไม่มีใครจำได้ → "Snowflake Server"
```

**Snowflake Server** = server ที่ unique มากจนไม่มีใครกล้าแตะหรือ recreate

### หลังมี IaC

```hcl
# main.tf — server ทั้งหมดอยู่ในไฟล์นี้
resource "aws_instance" "app_server" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
  tags = { Name = "task-tracker-prod" }
}
```

ใครก็อ่านออก, review ได้, recreate ได้ทุกเมื่อ


## ✅ ข้อดีของ IaC

| ข้อดี | รายละเอียด |
| :--- | :--- |
| **Reproducible** | สร้าง environment เหมือนกันได้ทุกครั้ง |
| **Version Control** | infrastructure เปลี่ยนตาม code → git history |
| **Reviewable** | PR review infrastructure change ก่อน apply |
| **Automated** | รัน CI/CD สร้าง infrastructure อัตโนมัติ |
| **Documented** | code คือ documentation |


## 🔧 Terraform — IaC ที่ใช้มากที่สุด

**Terraform** (HashiCorp) ใช้ภาษา **HCL (HashiCorp Configuration Language)** เป็น declarative

### Declarative vs Imperative

```
Imperative (แบบบอกขั้นตอน):
  "ไปซื้อไข่ 6 ฟอง แล้วไปซื้อนม แล้วกลับบ้าน"
  → ถ้าซื้อไข่ไม่ได้ต้องเขียน logic จัดการเอง

Declarative (แบบบอกเป้าหมาย):
  "ฉันต้องการไข่ 6 ฟองและนม 1 ลิตรอยู่ที่บ้าน"
  → Terraform หาวิธีจัดการเอง ถ้ามีอยู่แล้วก็ไม่ซื้อซ้ำ
```

```hcl
# HCL — บอกว่าต้องการอะไร ไม่ใช่บอกวิธีทำ
resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t2.micro"
}

# Terraform คำนวณเองว่าต้อง create/update/delete อะไร
```


## 📝 Terraform ทำงานอย่างไร?

```bash
# 1. terraform init — ดาวน์โหลด providers
terraform init
# ✓ Installed hashicorp/aws v5.0.0
# ✓ Initialized provider plugins

# 2. terraform plan — ดูก่อนว่าจะเปลี่ยนอะไร
terraform plan
# Plan: 1 to add, 0 to change, 0 to destroy.
# + aws_instance.web will be created
#   + ami = "ami-0c55b159cbfafe1f0"
#   + instance_type = "t2.micro"

# 3. terraform apply — ทำจริง
terraform apply
# Do you want to perform these actions? yes
# aws_instance.web: Creating...
# aws_instance.web: Creation complete after 30s [id=i-0abc123]

# 4. terraform destroy — ลบทุกอย่าง
terraform destroy
```


## 🏗️ โครงสร้าง Terraform สำหรับ Task Tracker

```hcl
# providers.tf
terraform {
  required_providers {
    render = {                         # Render provider (unofficial)
      source  = "render-oss/render"
      version = "~> 1.0"
    }
  }
}

# main.tf — สร้าง Render services
resource "render_web_service" "api" {
  name   = "task-tracker-api"
  plan   = "free"
  region = "singapore"

  runtime_source = {
    docker = {
      dockerfile_path = "./Dockerfile"
    }
  }

  env_vars = {
    NODE_ENV = { value = "production" }
    PORT     = { value = "3000" }
  }
}

# outputs.tf — แสดงค่าหลัง apply
output "api_url" {
  value = render_web_service.api.url
}
```


## 🔄 IaC ใน CI/CD Pipeline

```yaml
# .github/workflows/infrastructure.yml
name: Infrastructure

on:
  push:
    paths: ['terraform/**']
    branches: [main]

jobs:
  terraform:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: hashicorp/setup-terraform@v3
        with:
          terraform_version: '1.7.0'

      - name: Terraform Init
        run: terraform init
        working-directory: terraform/

      - name: Terraform Plan
        run: terraform plan -out=tfplan
        working-directory: terraform/

      - name: Terraform Apply
        run: terraform apply tfplan
        working-directory: terraform/
        env:
          RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
```


## 🌐 Alternatives ที่น่ารู้จัก

| Tool | โดย | ใช้กับ | ภาษา |
| :--- | :--- | :--- | :--- |
| **Terraform** | HashiCorp | ทุก cloud | HCL |
| **Pulumi** | Pulumi | ทุก cloud | TypeScript, Python |
| **AWS CloudFormation** | AWS | AWS เท่านั้น | YAML/JSON |
| **Ansible** | Red Hat | Configuration Management | YAML |

> Terraform เป็น standard ที่บริษัทส่วนใหญ่ใช้ — รู้ไว้ก่อนหางาน


## 💡 สรุป

::: info IaC กับ DevOps
IaC ทำให้ **infrastructure เหมือน code** — version control ได้, review ได้, automate ได้  
ใน course นี้ Render จัดการ infrastructure ให้ผ่าน dashboard  
แต่ concept Declarative → Terraform → `plan` ก่อน `apply` คือ foundation ที่ควรรู้
:::


**← ก่อนหน้า:** [SLI/SLO/SLA](/wk8/wk8-content3-slo-sla)  
**ถัดไป →** [Incident Response](/wk8/wk8-content5-incident-response)
