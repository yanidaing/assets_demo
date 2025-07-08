module.exports = {
  database: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "asset",
  },
  server: {
    port: process.env.PORT || 4000,
  },
};
