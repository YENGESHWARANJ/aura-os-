const express = require("express");
const router = express.Router();
const authenticate = require("../../middleware/auth/authenticate");
const notificationController = require("../../controllers/notificationController");

router.use(authenticate);

// Existing notification routes
router.get("/", notificationController.getNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/:id/read", notificationController.markAsRead);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.delete("/:id", notificationController.deleteNotification);

// Multi-channel extensions
router.post("/device-token/register", notificationController.registerDeviceToken);
router.post("/device-token/unregister", notificationController.unregisterDeviceToken);
router.get("/preferences", notificationController.getPreferences);
router.put("/preferences", notificationController.updatePreferences);
router.post("/send-test", notificationController.sendTestNotification);

module.exports = router;
