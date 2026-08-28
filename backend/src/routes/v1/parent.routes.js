const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const parentCtrl = require("../../controllers/parentController");

router.use(authenticate);
router.use(authorize(["parent", "admin"]));

router.get("/overview", parentCtrl.getParentOverview);
router.get("/attendance", parentCtrl.getChildAttendance);
router.get("/grades", parentCtrl.getChildGrades);

module.exports = router;
