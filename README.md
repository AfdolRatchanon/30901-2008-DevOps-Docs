# 30901-2008 การพัฒนาซอฟต์แวร์รูปแบบเดฟออฟส์

ตำราเรียนรายวิชา **30901-2008 DevOps Style Software Development**
ระดับประกาศนียบัตรวิชาชีพชั้นสูง (ปวส.) | หน่วยกิต 1-4-3

🌐 **อ่านออนไลน์:** https://AfdolRatchanon.github.io/30901-2008-DevOps-Docs/


## โครงสร้างโปรเจกต์

```
├── docs/          ← VitePress source (ตำราเรียน)
├── starter/       ← Template โปรเจกต์ Task Tracker สำหรับนักเรียน
└── .github/
    └── workflows/ ← GitHub Actions (auto deploy ตำราเรียน)
```

## รันในเครื่อง

```bash
npm install
npm run docs:dev
```

## Tech Stack ที่สอนในวิชา

| หมวด | เครื่องมือ |
|---|---|
| OS & Shell | Linux (WSL2), Bash |
| Version Control | Git, GitHub |
| Container | Docker, Docker Compose |
| CI/CD | GitHub Actions |
| Testing | Jest, Supertest, k6 |
| Deploy | Render, GitHub Pages |
| IaC | Terraform (concepts) |
