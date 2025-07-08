const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const session = require("express-session");
const passport = require("passport");
require("./config/passport");
const assetRoutes = require("./routes/asset.js");
const userRoutes = require("./routes/user.js");

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());

app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/assets", assetRoutes);
app.use("/api/users", userRoutes);

// Google OAuth routes
app.get(
  "/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  function (req, res) {
    // Redirect to login page, let frontend handle role-based redirect
    res.redirect("http://localhost:3000/login");
  }
);

// เพิ่ม endpoint สำหรับเช็ค session และคืน user+role
app.get("/api/auth/me", (req, res) => {
  if (req.isAuthenticated() && req.user) {
    // ส่งข้อมูล user (เช่น id, email, role, full_name, profile_picture_url)
    const {
      id,
      email,
      role,
      full_name,
      first_name,
      last_name,
      profile_picture_url,
    } = req.user;
    res.json({
      id,
      email,
      role,
      full_name,
      first_name,
      last_name,
      profile_picture_url,
    });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
});

// เพิ่ม endpoint สำหรับ logout
app.post("/api/auth/logout", (req, res) => {
  req.logout(function (err) {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
    req.session.destroy(() => {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    });
  });
});

app.listen(port, () => {
  console.log(`Backend server running at Port ${port}`);
});
