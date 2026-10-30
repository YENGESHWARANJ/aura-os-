const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const authorize = require("../../middleware/auth/authorize");
const evidenceCtrl = require("../../controllers/evidenceController");

// PUBLIC ENDPOINT - No authentication required
router.get("/public/:verificationId", evidenceCtrl.getPublicVerification);

// AUTHENTICATED ENDPOINTS
router.use(authenticate);

// Student evidence wallet
router.get("/wallet", evidenceCtrl.getWallet);
router.post("/", evidenceCtrl.createEvidence);
router.patch("/:id/disclosure", evidenceCtrl.updateDisclosure);

// Faculty & Mentor verification queue
router.get(
  "/pending",
  authorize("faculty", "mentor", "admin", "super-admin"),
  evidenceCtrl.getPendingQueue
);

router.patch(
  "/:id/verify",
  authorize("faculty", "mentor", "admin", "super-admin"),
  evidenceCtrl.verifyEvidence
);

module.exports = router;
