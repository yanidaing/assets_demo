const express = require("express");
const { getUsers, updateRole } = require("../controllers/userController");

const router = express.Router();

router.get("/", getUsers);
router.patch("/:id/role", updateRole);

module.exports = router;
