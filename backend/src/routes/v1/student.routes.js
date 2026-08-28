const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const studentCtrl = require("../../controllers/studentController");

router.use(authenticate);
router.use(authorize(["student", "admin"]));

router.get("/overview", studentCtrl.getStudentOverview);
router.get("/academics", studentCtrl.getAcademics);
router.get("/attendance", studentCtrl.getAttendance);

module.exports = router;
