const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const aiCtrl = require("../../controllers/aiController");

router.use(authenticate);

router.post("/chat", aiCtrl.chat);
router.get("/context", aiCtrl.getContext);
router.get("/conversations", aiCtrl.getConversations);
router.get("/conversations/:id", aiCtrl.getMessages);
router.delete("/conversations/:id", aiCtrl.deleteConversation);
router.post("/messages/:id/feedback", aiCtrl.setFeedback);
router.post("/translate", aiCtrl.translate);

module.exports = router;
