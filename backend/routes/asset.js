const express = require("express");
const {
  getAssetByBarcode,
  patchAssetStatus,
  getAssets,
  getStats,
  getSummary,
  getReport,
} = require("../controllers/assetController.js");

const router = express.Router();

router.get("/stats", getStats);
router.get("/summary", getSummary);
router.get("/report", getReport);
router.get("/", getAssets);

router.get("/:barcode", getAssetByBarcode);
router.patch("/:barcode/status", patchAssetStatus);

module.exports = router;
