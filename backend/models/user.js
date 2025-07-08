const pool = require("../lib/db");

// Find user by email
async function findUserByEmail(email) {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
}

// Find user by provider and provider_user_id
async function findUserByProvider(provider, providerUserId) {
  const [rows] = await pool.query(
    "SELECT u.* FROM users u JOIN user_identities ui ON u.id = ui.user_id WHERE ui.provider = ? AND ui.provider_user_id = ? LIMIT 1",
    [provider, providerUserId]
  );
  return rows[0];
}

// Create user and user_identity
async function createUserWithIdentity({
  email,
  full_name,
  first_name,
  last_name,
  profile_picture_url,
  provider,
  provider_user_id,
  role = "user",
}) {
  const [userResult] = await pool.query(
    "INSERT INTO users (email, role, full_name, first_name, last_name, profile_picture_url) VALUES (?, ?, ?, ?, ?, ?)",
    [email, role, full_name, first_name, last_name, profile_picture_url]
  );
  const userId = userResult.insertId;
  await pool.query(
    "INSERT INTO user_identities (user_id, provider, provider_user_id) VALUES (?, ?, ?)",
    [userId, provider, provider_user_id]
  );
  return findUserByEmail(email);
}

// Update user profile (on login)
async function updateUserProfile({
  id,
  full_name,
  first_name,
  last_name,
  profile_picture_url,
}) {
  await pool.query(
    "UPDATE users SET full_name=?, first_name=?, last_name=?, profile_picture_url=?, updated_at=NOW(), last_login_at=NOW() WHERE id=?",
    [full_name, first_name, last_name, profile_picture_url, id]
  );
}

// Get all users
async function getAllUsers() {
  const [rows] = await pool.query("SELECT * FROM users ORDER BY id ASC");
  return rows;
}

// Update user role by id
async function updateUserRole(id, role) {
  const [result] = await pool.query("UPDATE users SET role = ? WHERE id = ?", [
    role,
    id,
  ]);
  return result.affectedRows > 0;
}

module.exports = {
  findUserByEmail,
  findUserByProvider,
  createUserWithIdentity,
  updateUserProfile,
  getAllUsers,
  updateUserRole,
};
