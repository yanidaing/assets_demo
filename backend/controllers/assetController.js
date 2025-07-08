const {
  findAssetByBarcode,
  updateAssetStatus,
  getAllAssets,
  getAssetStats,
  getAssetSummary,
  getAssetReport,
  updateAssetById,
  deleteAssetById,
  createAsset,
} = require("../models/asset.js");

async function getAssetByBarcode(req, res) {
  const { barcode } = req.params;
  if (!barcode || barcode.length !== 15) {
    return res.status(400).json({ error: "Barcode must be 15 digits" });
  }
  const asset = await findAssetByBarcode(barcode);
  if (!asset) {
    return res.status(404).json({ error: "Asset not found" });
  }
  res.json(asset);
}

async function patchAssetStatus(req, res) {
  const { barcode } = req.params;
  const { status } = req.body;
  if (!barcode || barcode.length !== 15) {
    return res.status(400).json({ error: "Barcode must be 15 digits" });
  }
  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }
  const success = await updateAssetStatus(barcode, status);
  if (!success) {
    return res
      .status(404)
      .json({ error: "Asset not found or status not updated" });
  }
  res.json({ message: "Status updated" });
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

async function updateAsset(req, res) {
  const { id } = req.params;
  const asset = req.body;
  try {
    const updated = await updateAssetById(id, asset);
    if (!updated) return res.status(404).json({ error: "Asset not found" });
    res.json({ ...asset, id: Number(id) });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
}

async function deleteAsset(req, res) {
  const { id } = req.params;
  try {
    const deleted = await deleteAssetById(id);
    if (!deleted) return res.status(404).json({ error: "Asset not found" });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
}

async function addAsset(req, res) {
  const asset = req.body;
  try {
    const created = await createAsset(asset);
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ error: "Create failed" });
  }
}

module.exports = {
  getAssetByBarcode,
  patchAssetStatus,
  getAssets,
  getStats,
  getSummary,
  getReport,
  updateAsset,
  deleteAsset,
  addAsset,
};
