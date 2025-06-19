const {
  findAssetByBarcode,
  updateAssetStatus,
  getAllAssets,
  getAssetStats,
  getAssetSummary,
  getAssetReport,
} = require('../models/asset.js');

async function getAssetByBarcode(req, res) {
  const { barcode } = req.params;
  if (!barcode || barcode.length !== 15) {
    return res.status(400).json({ error: 'Barcode must be 15 digits' });
  }
  const asset = await findAssetByBarcode(barcode);
  if (!asset) {
    return res.status(404).json({ error: 'Asset not found' });
  }
  res.json(asset);
}

async function patchAssetStatus(req, res) {
  const { barcode } = req.params;
  const { status } = req.body;
  if (!barcode || barcode.length !== 15) {
    return res.status(400).json({ error: 'Barcode must be 15 digits' });
  }
  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }
  const success = await updateAssetStatus(barcode, status);
  if (!success) {
    return res.status(404).json({ error: 'Asset not found or status not updated' });
  }
  res.json({ message: 'Status updated' });
}

async function getAssets(req, res) {
  const assets = await getAllAssets();
  res.json(assets);
}

async function getStats(req, res) {
  const stats = await getAssetStats();
  res.json(stats);
}

async function getSummary(req, res) {
  const summary = await getAssetSummary();
  res.json(summary);
}

async function getReport(req, res) {
  const report = await getAssetReport();
  res.json(report);
}

module.exports = {
  getAssetByBarcode,
  patchAssetStatus,
  getAssets,
  getStats,
  getSummary,
  getReport,
}; 