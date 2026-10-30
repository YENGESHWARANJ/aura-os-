const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const dashboardCtrl = require("../../controllers/dashboardController");

router.use(authenticate);

router.get("/overview", dashboardCtrl.getOverview);

module.exports = router;
