/**
 * ไฟล์ทดสอบสำหรับฟังก์ชันจัดการวันที่
 * สามารถรันได้ด้วย: npm test
 */

import {
  formatDate,
  formatDateTime,
  formatShortDate,
  getRelativeTime,
  isFutureDate,
  isPastDate,
  isToday,
} from "./dateUtils";

// ตัวอย่างการใช้งานฟังก์ชันต่างๆ

console.log("=== การทดสอบฟังก์ชันจัดการวันที่ ===\n");

// ตัวอย่างวันที่จากฐานข้อมูล
const sampleDates = [
  "2024-01-15T17:00:00.000Z",
  "2024-02-20T09:30:00.000Z",
  "2024-03-10T14:45:00.000Z",
  "2024-12-25T00:00:00.000Z",
  "2025-01-01T12:00:00.000Z",
];

console.log("1. การจัดรูปแบบวันที่ (formatDate):");
sampleDates.forEach((date) => {
  console.log(`${date} -> ${formatDate(date)}`);
});

console.log("\n2. การจัดรูปแบบวันที่และเวลา (formatDateTime):");
sampleDates.forEach((date) => {
  console.log(`${date} -> ${formatDateTime(date)}`);
});

console.log("\n3. การจัดรูปแบบวันที่แบบย่อ (formatShortDate):");
sampleDates.forEach((date) => {
  console.log(`${date} -> ${formatShortDate(date)}`);
});

console.log("\n4. การแสดง relative time (getRelativeTime):");
const now = new Date();
const pastDates = [
  new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(), // 1 วันที่แล้ว
  new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), // 2 ชั่วโมงที่แล้ว
  new Date(now.getTime() - 30 * 60 * 1000).toISOString(), // 30 นาทีที่แล้ว
];

pastDates.forEach((date) => {
  console.log(`${date} -> ${getRelativeTime(date)}`);
});

console.log("\n5. การตรวจสอบวันที่ในอนาคต (isFutureDate):");
sampleDates.forEach((date) => {
  console.log(`${date} -> ${isFutureDate(date) ? "อนาคต" : "ไม่ใช่อนาคต"}`);
});

console.log("\n6. การตรวจสอบวันที่ในอดีต (isPastDate):");
sampleDates.forEach((date) => {
  console.log(`${date} -> ${isPastDate(date) ? "อดีต" : "ไม่ใช่อดีต"}`);
});

console.log("\n7. การตรวจสอบวันนี้ (isToday):");
const today = new Date().toISOString();
console.log(`${today} -> ${isToday(today) ? "วันนี้" : "ไม่ใช่วันนี้"}`);

// ตัวอย่างการใช้งานจริง
console.log("\n=== ตัวอย่างการใช้งานจริง ===");

const assetDates = [
  { name: "Laptop Dell", date: "2024-01-15T17:00:00.000Z" },
  { name: "Printer HP", date: "2024-02-20T09:30:00.000Z" },
  { name: "Projector Epson", date: "2024-03-10T14:45:00.000Z" },
];

console.log("\nรายการทรัพย์สิน:");
assetDates.forEach((asset) => {
  console.log(
    `${asset.name}: ${formatDate(asset.date)} (${getRelativeTime(asset.date)})`
  );
});

export {
  formatDate,
  formatDateTime,
  formatShortDate,
  getRelativeTime,
  isFutureDate,
  isPastDate,
  isToday,
};
