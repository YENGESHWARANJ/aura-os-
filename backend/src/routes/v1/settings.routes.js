const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const settingsCtrl = require("../../controllers/settingsController");

router.use(authenticate);

router.get("/", settingsCtrl.getSettings);
router.put("/", settingsCtrl.updateSettings);

module.exports = router;
