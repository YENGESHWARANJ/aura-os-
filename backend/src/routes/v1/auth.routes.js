const express = require("express");
const router = express.Router();

const register = require("../../controllers/auth/registerController");
const login = require("../../controllers/auth/loginController");
const profile = require("../../controllers/auth/profileController");
const refresh = require("../../controllers/auth/refreshController");
const logout = require("../../controllers/auth/logoutController");
const changePassword = require("../../controllers/auth/changePasswordController");
const authenticate = require("../../middleware/auth/authenticate");

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authenticate, profile);
router.post("/refresh", refresh);
router.post("/logout", authenticate, logout);
router.put("/change-password", authenticate, changePassword);

module.exports = router;