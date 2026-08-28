const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const upload = require("../../middleware/uploadMiddleware");
const profileCtrl = require("../../controllers/profileController");

router.use(authenticate);

router.get("/", profileCtrl.getProfile);
router.patch("/", profileCtrl.updateProfile);
router.post("/avatar", upload.single("avatar"), profileCtrl.uploadAvatar);
router.delete("/avatar", profileCtrl.deleteAvatar);
router.post("/resume", upload.single("resume"), profileCtrl.uploadResume);
router.delete("/resume", profileCtrl.deleteResume);

module.exports = router;
