// [1] Task type — นักเรียนจะ extend type นี้ตลอดวิชา
export interface Task {
  id: string          // [2] unique identifier
  title: string       // [3] ชื่อ task
  done: boolean       // [4] สถานะ: ทำแล้ว / ยังไม่ทำ
  createdAt: string   // [5] วันเวลาที่สร้าง
}

// [6] สำหรับสร้าง task ใหม่ — ไม่ต้องส่ง id และ createdAt
export type CreateTaskInput = Pick<Task, 'title'>

// [7] สำหรับอัปเดต task — ทุก field เป็น optional
export type UpdateTaskInput = Partial<Pick<Task, 'title' | 'done'>>
