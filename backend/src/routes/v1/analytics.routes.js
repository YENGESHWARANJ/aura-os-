const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const { getOverview } = require("../../controllers/analyticsController");

router.use(authenticate);

router.get("/overview", getOverview);

module.exports = router;
