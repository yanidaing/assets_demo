const express = require("express");
const {
  getAssetByBarcode,
  patchAssetStatus,
  getAssets,
  getStats,
  getSummary,
  getReport,
  updateAsset,
  deleteAsset,
  addAsset,
} = require("../controllers/assetController.js");

const router = express.Router();

router.get("/stats", getStats);
router.get("/summary", getSummary);
router.get("/report", getReport);
router.get("/", getAssets);

router.put("/:id", updateAsset);
router.delete("/:id", deleteAsset);
router.get("/barcode/:barcode", getAssetByBarcode);
router.patch("/barcode/:barcode/status", patchAssetStatus);
router.post("/", addAsset);

module.exports = router;
