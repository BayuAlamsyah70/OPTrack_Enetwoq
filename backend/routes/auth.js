const express = require("express");
const router = express.Router();
const { login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/login", login);
router.get("/verify", authMiddleware(["Sales", "Admin"]), (req, res) => {
  res.json({ userId: req.user.id, role: req.user.role });
});

module.exports = router;
