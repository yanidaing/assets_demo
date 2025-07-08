const { getAllUsers, updateUserRole } = require("../models/user");

async function getUsers(req, res) {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

async function updateRole(req, res) {
  const { id } = req.params;
  const { role } = req.body;
  if (!role) return res.status(400).json({ error: "Role is required" });
  try {
    const success = await updateUserRole(id, role);
    if (!success) return res.status(404).json({ error: "User not found" });
    res.json({ message: "Role updated" });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
}

module.exports = { getUsers, updateRole };
