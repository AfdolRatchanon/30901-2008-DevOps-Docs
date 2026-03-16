import express from 'express'               // [1] import Express framework
import path from 'path'                      // [2] จัดการ file path
import { taskRouter } from './routes/tasks'  // [3] import router สำหรับ tasks

const app = express()                        // [4] สร้าง Express app
const PORT = process.env.PORT || 3000        // [5] port จาก env หรือ default 3000

// [6] Middleware: แปลง request body เป็น JSON อัตโนมัติ
app.use(express.json())

// [7] Serve static frontend จาก public/
app.use(express.static(path.join(__dirname, '../public')))

// [8] Routes
app.use('/tasks', taskRouter)

// [9] Health check endpoint — สำคัญสำหรับ monitoring (wk8)
app.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    uptime: Math.floor(process.uptime()),
    version: process.env.npm_package_version || '1.0.0',
  })
})

// [10] เริ่ม server
app.listen(PORT, () => {
  console.log(`Task Tracker running on http://localhost:${PORT}`)
})

export { app } // [11] export สำหรับ test
