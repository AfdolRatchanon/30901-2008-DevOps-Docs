# Lab: Test in Pipeline <Badge type="tip" text="Module 7 · Lab 1" />

::: warning 🚧 กำลังจัดทำเนื้อหา
เนื้อหาในส่วนนี้กำลังอยู่ระหว่างการจัดทำ
:::

## สิ่งที่จะทำใน Lab นี้

- เขียน Unit Test สำหรับ Task Tracker API ด้วย Jest + Supertest
  - `GET /tasks` ต้องคืน array
  - `POST /tasks` ต้องสร้าง task และคืน status 201
  - `DELETE /tasks/:id` ต้องลบและคืน 200
- ตั้งค่า ESLint ใน project
- เพิ่ม quality gate ใน `ci.yml`:
  - `npm run lint` ต้อง pass
  - `npm test` ต้อง pass
  - Coverage ≥ 60% ถ้าไม่ถึง pipeline fail
- ทดสอบว่า commit ที่ tests fail ทำให้ pipeline สีแดง ✅

**เป้าหมาย:** pipeline บังคับ code quality ก่อน merge ได้จริง ✅
