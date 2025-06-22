# การติดตั้งและใช้งาน Asset Management System

## ข้อกำหนดเบื้องต้น

- Node.js (เวอร์ชัน 16 หรือใหม่กว่า)
- MySQL (เวอร์ชัน 8.0 หรือใหม่กว่า)
- npm หรือ yarn

## การติดตั้ง

### 1. ติดตั้งฐานข้อมูล MySQL

1. เปิด MySQL Workbench หรือ phpMyAdmin
2. รันไฟล์ `database/schema.sql` เพื่อสร้างฐานข้อมูลและตาราง
3. หรือรันคำสั่ง SQL ต่อไปนี้:

```sql
CREATE DATABASE IF NOT EXISTS assets;
USE assets;

CREATE TABLE IF NOT EXISTS assets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    barcode VARCHAR(15) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    status ENUM('Activated', 'Lost', 'Damaged') DEFAULT 'Activated',
    description TEXT,
    Location VARCHAR(255),
    Agency VARCHAR(255),
    Date DATE,
    image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### 2. ตั้งค่า Backend

1. เข้าไปที่โฟลเดอร์ backend:

```bash
cd backend
```

2. ติดตั้ง dependencies:

```bash
npm install
```

3. สร้างไฟล์ `.env` ในโฟลเดอร์ backend:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_password
DB_NAME=assets
PORT=4000
```

4. รันเซิร์ฟเวอร์ backend:

```bash
npm run dev
```

### 3. ตั้งค่า Frontend

1. เข้าไปที่โฟลเดอร์ frontend:

```bash
cd frontend
```

2. ติดตั้ง dependencies:

```bash
npm install
```

3. รันเซิร์ฟเวอร์ frontend:

```bash
npm run dev
```

## การใช้งาน

1. เปิดเบราว์เซอร์และไปที่ `http://localhost:3000`
2. ระบบจะแสดงตาราง assets ที่ดึงข้อมูลจากฐานข้อมูล MySQL
3. ตารางจะแสดงข้อมูลต่อไปนี้:
   - ID
   - Image
   - Name
   - Description
   - Location
   - Agency
   - Date
   - Status

## ฟีเจอร์ที่มี

- แสดงรายการ assets ทั้งหมด
- กรองตามสถานะ (All, Activated, Lost, Damaged)
- Pagination สำหรับการแบ่งหน้า
- การแสดงรูปภาพของ asset
- การแสดงสถานะด้วยสีที่แตกต่างกัน

## การแก้ไขปัญหา

### ปัญหาการเชื่อมต่อฐานข้อมูล

- ตรวจสอบว่า MySQL กำลังทำงานอยู่
- ตรวจสอบข้อมูลการเชื่อมต่อในไฟล์ `.env`
- ตรวจสอบว่าฐานข้อมูล `assets` ถูกสร้างแล้ว

### ปัญหาการแสดงข้อมูล

- ตรวจสอบว่า backend server กำลังทำงานที่ port 4000
- ตรวจสอบ console ในเบราว์เซอร์สำหรับ error messages
- ตรวจสอบ Network tab ใน Developer Tools

## โครงสร้างฐานข้อมูล

ตาราง `assets` มีคอลัมน์ดังนี้:

- `id`: รหัสประจำตัว (Auto Increment)
- `barcode`: บาร์โค้ด (15 หลัก, Unique) - ใช้สำหรับ backend เท่านั้น
- `name`: ชื่ออุปกรณ์
- `status`: สถานะ (Activated, Lost, Damaged)
- `description`: คำอธิบาย
- `Location`: ที่ตั้ง
- `Agency`: หน่วยงาน
- `Date`: วันที่
- `image`: URL รูปภาพ
- `created_at`: วันที่สร้าง
- `updated_at`: วันที่อัปเดต

**หมายเหตุ**: คอลัมน์ `barcode` จะไม่แสดงในหน้า frontend แต่ยังคงใช้ใน backend สำหรับการจัดการข้อมูล
