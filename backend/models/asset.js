const pool = require("../lib/db.js");

async function findAssetByBarcode(barcode) {
  const [rows] = await pool.query("SELECT * FROM asset WHERE barcode = ?", [
    barcode,
  ]);
  return rows[0];
}

async function updateAssetStatus(barcode, status) {
  const [result] = await pool.query(
    "UPDATE asset SET status = ? WHERE barcode = ?",
    [status, barcode]
  );
  return result.affectedRows > 0;
}

async function getAllAssets() {
  const [rows] = await pool.query(
    "SELECT id, image, name, Location, Agency, Date, status, Barcode FROM asset ORDER BY id ASC"
  );
  return rows;
}

async function getAssetStats() {
  const [rows] = await pool.query(
    "SELECT status, COUNT(*) as count FROM asset GROUP BY status"
  );
  return rows;
}

async function getAssetSummary() {
  const [[total]] = await pool.query("SELECT COUNT(*) as total FROM asset");
  const [statusRows] = await pool.query(
    "SELECT status, COUNT(*) as count FROM asset GROUP BY status"
  );
  return {
    total: total.total,
    statuses: statusRows.reduce(
      (acc, s) => ({ ...acc, [s.status]: s.count }),
      {}
    ),
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
      { month: "Jan", value: 12000 },
      { month: "Feb", value: 15000 },
      { month: "Mar", value: 18000 },
      { month: "Apr", value: 14000 },
      { month: "May", value: 20000 },
      { month: "Jun", value: 17000 },
    ],
  };
}

async function updateAssetById(id, asset) {
  const [result] = await pool.query(
    `UPDATE asset SET name=?, Location=?, Agency=?, Date=?, status=?, image=?, Barcode=? WHERE id=?`,
    [
      asset.name,
      asset.Location,
      asset.Agency,
      asset.Date,
      asset.status,
      asset.image,
      asset.Barcode,
      id,
    ]
  );
  return result.affectedRows > 0;
}

async function deleteAssetById(id) {
  const [result] = await pool.query(`DELETE FROM asset WHERE id=?`, [id]);
  return result.affectedRows > 0;
}

async function createAsset(asset) {
  const [result] = await pool.query(
    `INSERT INTO asset (name, Location, Agency, Date, status, image, Barcode) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      asset.name,
      asset.Location,
      asset.Agency,
      asset.Date,
      asset.status,
      asset.image || null,
      asset.Barcode,
    ]
  );
  return { ...asset, id: result.insertId };
}

module.exports = {
  findAssetByBarcode,
  updateAssetStatus,
  getAllAssets,
  getAssetStats,
  getAssetSummary,
  getAssetReport,
  updateAssetById,
  deleteAssetById,
  createAsset,
};
