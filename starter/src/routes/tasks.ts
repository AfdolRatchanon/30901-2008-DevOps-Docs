import { Router } from 'express'
import { randomUUID } from 'crypto'
import { Task, CreateTaskInput, UpdateTaskInput } from '../types/task'

export const taskRouter = Router()

// [1] In-memory storage — จะย้ายไป JSON file ใน lab
let tasks: Task[] = []

// [2] GET /tasks — ดู task ทั้งหมด
taskRouter.get('/', (_req, res) => {
  res.json(tasks)
})

// [3] GET /tasks/:id — ดู task เดียว
taskRouter.get('/:id', (req, res) => {
  const task = tasks.find(t => t.id === req.params.id)
  if (!task) return res.status(404).json({ error: 'Task not found' })
  res.json(task)
})

// [4] POST /tasks — สร้าง task ใหม่
taskRouter.post('/', (req, res) => {
  const body = req.body as CreateTaskInput
  if (!body.title) {
    return res.status(400).json({ error: 'title is required' })
  }
  const newTask: Task = {
    id: randomUUID(),         // [5] สร้าง unique id อัตโนมัติ
    title: body.title,
    done: false,
    createdAt: new Date().toISOString(),
  }
  tasks.push(newTask)
  res.status(201).json(newTask)
})

// [6] PUT /tasks/:id — อัปเดต task
taskRouter.put('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Task not found' })
  const update = req.body as UpdateTaskInput
  tasks[index] = { ...tasks[index], ...update }
  res.json(tasks[index])
})

// [7] DELETE /tasks/:id — ลบ task
taskRouter.delete('/:id', (req, res) => {
  const index = tasks.findIndex(t => t.id === req.params.id)
  if (index === -1) return res.status(404).json({ error: 'Task not found' })
  tasks.splice(index, 1)
  res.status(200).json({ message: 'Task deleted' })
})
