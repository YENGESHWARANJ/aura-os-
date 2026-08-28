const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const adminCtrl = require("../../controllers/adminController");

router.use(authenticate);
router.use(authorize(["admin"]));

router.get("/stats", adminCtrl.getDashboardStats);
router.get("/users", adminCtrl.getUsers);
router.post("/users", adminCtrl.createUser);
router.put("/users/:id", adminCtrl.updateUser);
router.delete("/users/:id", adminCtrl.deleteUser);
router.get("/departments", adminCtrl.getDepartments);
router.get("/logs", adminCtrl.getSystemLogs);

module.exports = router;
