const mysql = require("mysql2/promise");
const fetch = require("node-fetch");

// ตรวจสอบการเชื่อมต่อฐานข้อมูล
async function checkDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      database: process.env.DB_NAME || "assets",
    });

    const [rows] = await connection.execute(
      "SELECT COUNT(*) as count FROM assets"
    );
    console.log("✅ Database connection successful");
    console.log(`📊 Total assets in database: ${rows[0].count}`);

    await connection.end();
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    return false;
  }
}

// ตรวจสอบ API endpoints
async function checkAPI() {
  const endpoints = [
    { name: "Get all assets", url: "http://localhost:4000/api/assets" },
    { name: "Get asset stats", url: "http://localhost:4000/api/assets/stats" },
    {
      name: "Get asset summary",
      url: "http://localhost:4000/api/assets/summary",
    },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await fetch(endpoint.url);
      if (response.ok) {
        console.log(`✅ ${endpoint.name}: OK`);
      } else {
        console.log(
          `❌ ${endpoint.name}: ${response.status} ${response.statusText}`
        );
      }
    } catch (error) {
      console.log(`❌ ${endpoint.name}: ${error.message}`);
    }
  }
}

// ตรวจสอบ Frontend
async function checkFrontend() {
  try {
    const response = await fetch("http://localhost:3000");
    if (response.ok) {
      console.log("✅ Frontend is running");
    } else {
      console.log(
        `❌ Frontend error: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.log(`❌ Frontend not accessible: ${error.message}`);
  }
}

// รันการตรวจสอบทั้งหมด
async function runHealthCheck() {
  console.log("🔍 Running system health check...\n");

  console.log("📊 Checking Database...");
  await checkDatabase();

  console.log("\n🌐 Checking Backend API...");
  await checkAPI();

  console.log("\n🎨 Checking Frontend...");
  await checkFrontend();

  console.log("\n✅ Health check completed!");
}

// รันการตรวจสอบถ้าไฟล์นี้ถูกเรียกโดยตรง
if (require.main === module) {
  runHealthCheck().catch(console.error);
}

module.exports = { checkDatabase, checkAPI, checkFrontend, runHealthCheck };
