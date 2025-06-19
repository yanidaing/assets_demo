const pool = require('../lib/db.js');

async function findAssetByBarcode(barcode) {
  const [rows] = await pool.query('SELECT * FROM assets WHERE barcode = ?', [barcode]);
  return rows[0];
}

async function updateAssetStatus(barcode, status) {
  const [result] = await pool.query('UPDATE assets SET status = ? WHERE barcode = ?', [status, barcode]);
  return result.affectedRows > 0;
}

async function getAllAssets() {
  const [rows] = await pool.query('SELECT * FROM assets ORDER BY id ASC');
  return rows;
}

async function getAssetStats() {
  const [rows] = await pool.query('SELECT status, COUNT(*) as count FROM assets GROUP BY status');
  return rows;
}

async function getAssetSummary() {
  const [[total]] = await pool.query('SELECT COUNT(*) as total FROM assets');
  const [statusRows] = await pool.query('SELECT status, COUNT(*) as count FROM assets GROUP BY status');
  return {
    total: total.total,
    statuses: statusRows.reduce((acc, s) => ({ ...acc, [s.status]: s.count }), {})
  };
}

async function getAssetReport() {
  // Mock ข้อมูลรายงาน (เช่น รายได้, กราฟ)
  return {
    propertyIncome: 120923,
    propertySold: 234125,
    propertyOutcome: 26237,
    propertyClient: 34012,
    sellingReports: [
      { month: 'Jan', value: 12000 },
      { month: 'Feb', value: 15000 },
      { month: 'Mar', value: 18000 },
      { month: 'Apr', value: 14000 },
      { month: 'May', value: 20000 },
      { month: 'Jun', value: 17000 },
    ]
  };
}

module.exports = {
  findAssetByBarcode,
  updateAssetStatus,
  getAllAssets,
  getAssetStats,
  getAssetSummary,
  getAssetReport,
}; 