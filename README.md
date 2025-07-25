# Asset Management System

ระบบจัดการทรัพย์สินที่พัฒนาด้วย Next.js (Frontend) และ Node.js + Express (Backend) พร้อมฐานข้อมูล MySQL

## ฟีเจอร์หลัก

- 📊 แสดงรายการทรัพย์สินในรูปแบบตาราง
- 🔍 กรองข้อมูลตามสถานะ (Activated, Lost, Damaged)
- 📄 Pagination สำหรับการแบ่งหน้า
- 🖼️ แสดงรูปภาพของทรัพย์สิน
- 🎨 UI ที่สวยงามและใช้งานง่าย
- 📅 การจัดการวันที่แบบอัตโนมัติ

## โครงสร้างโปรเจค

```
ing/
├── backend/                 # Backend API (Node.js + Express)
│   ├── controllers/         # API Controllers
│   ├── lib/                # Database connection
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   └── server.js           # Main server file
├── frontend/               # Frontend (Next.js)
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Next.js pages
│   │   ├── services/       # API services
│   │   └── styles/         # CSS styles
│   └── public/             # Static files
├── database/               # Database schema
└── SETUP.md               # คู่มือการติดตั้ง
```

## การติดตั้งและใช้งาน

ดูรายละเอียดการติดตั้งได้ที่ [SETUP.md](./SETUP.md)

### การรันโปรเจคอย่างรวดเร็ว

#### Windows

```bash
start.bat
```

#### Linux/Mac

```bash
chmod +x start.sh
./start.sh
```

### การรันแบบแยกส่วน

#### Backend

```bash
cd backend
npm install
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## ข้อมูลที่แสดงในตาราง

ตาราง Assets จะแสดงข้อมูลต่อไปนี้:

| คอลัมน์     | คำอธิบาย                       |
| ----------- | ------------------------------ |
| ID          | รหัสประจำตัว (Auto Increment)  |
| Image       | รูปภาพของทรัพย์สิน             |
| Name        | ชื่อทรัพย์สิน                  |
| Description | คำอธิบาย                       |
| Location    | ที่ตั้ง                        |
| Agency      | หน่วยงาน                       |
| Date        | วันที่ (จัดรูปแบบอัตโนมัติ)    |
| Status      | สถานะ (Activated/Lost/Damaged) |

## การจัดการวันที่

ระบบมีการจัดการวันที่อัตโนมัติเพื่อแสดงผลในรูปแบบที่อ่านง่าย:

### รูปแบบวันที่ที่รองรับ:

- **ISO 8601**: `2024-01-15T17:00:00.000Z`
- **Date only**: `2024-01-15`
- **Thai format**: `15/01/2567`

### ฟังก์ชันจัดการวันที่:

- `formatDate()` - แสดงเฉพาะวันที่
- `formatDateTime()` - แสดงวันที่และเวลา
- `formatShortDate()` - แสดงวันที่แบบย่อ
- `getRelativeTime()` - แสดงเวลาสัมพัทธ์ (เช่น "2 วันที่แล้ว")

### ตัวอย่างการแปลง:

```
2024-01-15T17:00:00.000Z → 15/01/2567
2024-02-20T09:30:00.000Z → 20/02/2567
```

## API Endpoints

- `GET /api/assets` - ดึงข้อมูลทรัพย์สินทั้งหมด
- `GET /api/assets/:barcode` - ดึงข้อมูลทรัพย์สินตามบาร์โค้ด
- `PATCH /api/assets/:barcode/status` - อัปเดตสถานะทรัพย์สิน
- `GET /api/assets/stats` - ดึงสถิติทรัพย์สิน
- `GET /api/assets/summary` - ดึงสรุปข้อมูลทรัพย์สิน

## เทคโนโลยีที่ใช้

### Frontend

- Next.js
- React
- TypeScript
- CSS Modules
- React Icons

### Backend

- Node.js
- Express.js
- MySQL2
- CORS
- Dotenv

### Database

- MySQL

## การพัฒนา

### การเพิ่มฟีเจอร์ใหม่

1. สร้าง API endpoint ใน `backend/routes/`
2. เพิ่ม controller ใน `backend/controllers/`
3. เพิ่ม model ใน `backend/models/`
4. สร้าง component ใน `frontend/src/components/`
5. เพิ่ม service ใน `frontend/src/services/`

### การแก้ไขปัญหา

- ตรวจสอบ console ในเบราว์เซอร์
- ตรวจสอบ logs ของ backend server
- ตรวจสอบการเชื่อมต่อฐานข้อมูล

## License

MIT License
# assets_mfu
# assets_demo
# assets_demo
