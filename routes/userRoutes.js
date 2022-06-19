const express = require("express");
const router = express.Router();
const handleRefreshToken = require("../controllers/refreshTokenController");
const {
  PasswordReset,
  confirmReset,
} = require("../controllers/PasswordResetController");
const {
  registerUser,
  loginUser,
  verifyEmail,
} = require("../controllers/usersController");
// const { protect } = require("../middleware/authMiddleware");
const handleLogout = require("../controllers/logoutController");

router.post("/register", registerUser);
router.post("/login", loginUser);
// router.get("/me", protect, getMe);

router.get("/verify-email", verifyEmail);

router.get("/refresh", handleRefreshToken);

router.get("/logout", handleLogout);

router.post("/reset-password", PasswordReset);

router.post("/reset-password-confirm", confirmReset);

module.exports = router;
