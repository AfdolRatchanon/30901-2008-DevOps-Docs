import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '30901-2008 DevOps',
  description: 'การพัฒนาซอฟต์แวร์รูปแบบเดฟออฟส์ (DevOps Style Software Development)',
  lang: 'th-TH',
  base: '/30901-2008-DevOps-Docs/',

  themeConfig: {
    logo: '🚀',

    nav: [
      { text: 'หน้าแรก', link: '/' },
      { text: 'Course Outline', link: '/course-outline' },
      {
        text: 'โมดูล',
        items: [
          { text: 'M1: DevOps Foundation', link: '/wk1/wk1-content1-devops-intro' },
          { text: 'M2: Linux & Shell', link: '/wk2/wk2-content1-linux-cli' },
          { text: 'M3: Git & GitHub', link: '/wk3/wk3-content1-git-basics' },
          { text: 'M4: Docker & Cloud', link: '/wk4/wk4-content1-docker-basics' },
          { text: 'M5: Midterm', link: '/wk5/wk5-midterm-exam' },
          { text: 'M6: GitHub Actions', link: '/wk6/wk6-content1-cicd-basics' },
          { text: 'M7: Testing & QA', link: '/wk7/wk7-content1-testing' },
          { text: 'M8: Deploy & Monitor', link: '/wk8/wk8-content1-deployment' },
          { text: 'M9: Final Project', link: '/wk9/wk9-final-exam' },
        ],
      },
    ],

    sidebar: [
      {
        text: '📋 ภาพรวมรายวิชา',
        items: [
          { text: 'Course Outline', link: '/course-outline' },
        ],
      },

      // ─── Module 1 ───────────────────────────────────────────────────────────
      {
        text: 'Module 1 — DevOps Foundation',
        collapsed: false,
        items: [
          { text: '📖 DevOps คืออะไร', link: '/wk1/wk1-content1-devops-intro' },
          { text: '📖 SDLC Evolution', link: '/wk1/wk1-content2-sdlc-evolution' },
          { text: '📖 Value Stream', link: '/wk1/wk1-content3-value-stream' },
          { text: '📖 Agile + DevOps', link: '/wk1/wk1-content4-agile-devops' },
          { text: '📖 DORA Metrics', link: '/wk1/wk1-content5-dora-metrics' },
          { text: '🧪 Lab: ตั้งค่า Dev Environment', link: '/wk1/wk1-lab1-env-setup' },
        ],
      },

      // ─── Module 2 ───────────────────────────────────────────────────────────
      {
        text: 'Module 2 — Linux & Shell Script',
        collapsed: true,
        items: [
          { text: '📖 Linux CLI', link: '/wk2/wk2-content1-linux-cli' },
          { text: '📖 Shell Script', link: '/wk2/wk2-content2-shell-script' },
          { text: '📖 Text Processing', link: '/wk2/wk2-content3-text-processing' },
          { text: '📖 Networking for DevOps', link: '/wk2/wk2-content4-networking-devops' },
          { text: '🧪 Lab: Automation Script', link: '/wk2/wk2-lab1-automation' },
          { text: '🧪 Lab: Log Analysis', link: '/wk2/wk2-lab2-log-analysis' },
        ],
      },

      // ─── Module 3 ───────────────────────────────────────────────────────────
      {
        text: 'Module 3 — Git & GitHub',
        collapsed: true,
        items: [
          { text: '📖 Git Fundamentals', link: '/wk3/wk3-content1-git-basics' },
          { text: '📖 GitHub Collaboration', link: '/wk3/wk3-content2-github-collab' },
          { text: '📖 Git Advanced + Husky', link: '/wk3/wk3-content3-git-advanced' },
          { text: '🧪 Lab: Team Workflow', link: '/wk3/wk3-lab1-team-workflow' },
        ],
      },

      // ─── Module 4 ───────────────────────────────────────────────────────────
      {
        text: 'Module 4 — Docker & Cloud',
        collapsed: true,
        items: [
          { text: '📖 Docker Basics', link: '/wk4/wk4-content1-docker-basics' },
          { text: '📖 Dockerfile & Compose', link: '/wk4/wk4-content2-dockerfile-compose' },
          { text: '📖 Docker Security', link: '/wk4/wk4-content3-docker-security' },
          { text: '📖 Cloud Fundamentals', link: '/wk4/wk4-content4-cloud-fundamentals' },
          { text: '🧪 Lab: Containerize App', link: '/wk4/wk4-lab1-containerize' },
          { text: '🧪 Lab: Compose Advanced', link: '/wk4/wk4-lab2-compose-advanced' },
        ],
      },

      // ─── Module 5 ───────────────────────────────────────────────────────────
      {
        text: 'Module 5 — Midterm',
        collapsed: true,
        items: [
          { text: '🎯 Midterm Exam', link: '/wk5/wk5-midterm-exam' },
        ],
      },

      // ─── Module 6 ───────────────────────────────────────────────────────────
      {
        text: 'Module 6 — CI/CD with GitHub Actions',
        collapsed: true,
        items: [
          { text: '📖 CI/CD Basics', link: '/wk6/wk6-content1-cicd-basics' },
          { text: '📖 Advanced Actions', link: '/wk6/wk6-content2-advanced-actions' },
          { text: '📖 Deployment Patterns', link: '/wk6/wk6-content3-workflow-patterns' },
          { text: '📖 Secrets Management', link: '/wk6/wk6-content4-secrets-management' },
          { text: '🧪 Lab: Build Pipeline', link: '/wk6/wk6-lab1-pipeline' },
          { text: '🧪 Lab: Multi-Environment', link: '/wk6/wk6-lab2-multi-environment' },
        ],
      },

      // ─── Module 7 ───────────────────────────────────────────────────────────
      {
        text: 'Module 7 — Testing & Quality',
        collapsed: true,
        items: [
          { text: '📖 Testing with Jest', link: '/wk7/wk7-content1-testing' },
          { text: '📖 Security & Code Quality', link: '/wk7/wk7-content2-security-quality' },
          { text: '📖 API Testing', link: '/wk7/wk7-content3-api-testing' },
          { text: '📖 Performance Testing', link: '/wk7/wk7-content4-performance-testing' },
          { text: '🧪 Lab: Test in Pipeline', link: '/wk7/wk7-lab1-test-pipeline' },
        ],
      },

      // ─── Module 8 ───────────────────────────────────────────────────────────
      {
        text: 'Module 8 — Deploy & Monitor',
        collapsed: true,
        items: [
          { text: '📖 Cloud Deployment', link: '/wk8/wk8-content1-deployment' },
          { text: '📖 Monitoring & Logging', link: '/wk8/wk8-content2-monitoring' },
          { text: '📖 SLI / SLO / SLA', link: '/wk8/wk8-content3-slo-sla' },
          { text: '📖 IaC Introduction', link: '/wk8/wk8-content4-iac-intro' },
          { text: '📖 Incident Response', link: '/wk8/wk8-content5-incident-response' },
          { text: '📖 Documentation as Code', link: '/wk8/wk8-content6-documentation-code' },
          { text: '🧪 Lab: Go Production', link: '/wk8/wk8-lab1-production' },
          { text: '🧪 Lab: Monitoring Setup', link: '/wk8/wk8-lab2-monitoring-setup' },
        ],
      },

      // ─── Module 9 ───────────────────────────────────────────────────────────
      {
        text: 'Module 9 — Final Project',
        collapsed: true,
        items: [
          { text: '📖 DevOps Next Steps', link: '/wk9/wk9-content1-devops-next' },
          { text: '🎓 Final Exam', link: '/wk9/wk9-final-exam' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/AfdolRatchanon/30901-2008-DevOps-Docs' },
    ],

    footer: {
      message: '30901-2008 การพัฒนาซอฟต์แวร์รูปแบบเดฟออฟส์ (DevOps)',
    },

    search: {
      provider: 'local',
    },
  },

  markdown: {
    lineNumbers: true,
  },
})
