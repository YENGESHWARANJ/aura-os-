const notificationService = require("../services/notificationService");
const pushService = require("../services/pushNotificationService");

const getNotifications = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const onlyUnread = req.query.onlyUnread === "true";

    const data = await notificationService.getNotificationsForUser(req.user.id, req.user.role, {
      page,
      limit,
      onlyUnread,
    });
    return res.json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const count = await notificationService.getUnreadCount(req.user.id, req.user.role);
    return res.json({ success: true, data: { count } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markAsRead(req.user.id, req.user.role, req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found or unauthorized." });
    }
    return res.json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const result = await notificationService.markAllAsRead(req.user.id, req.user.role);
    return res.json({ success: true, data: { modifiedCount: result.modifiedCount } });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.deleteNotification(req.user.id, req.user.role, req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: "Notification not found or unauthorized." });
    }
    return res.json({ success: true, data: notification });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// --- Multi-Channel Extensions ---

const registerDeviceToken = async (req, res) => {
  try {
    const { deviceToken, platform, deviceName } = req.body;
    if (!deviceToken) {
      return res.status(400).json({ success: false, message: "deviceToken is required" });
    }

    const tokenRecord = await pushService.registerDeviceToken({
      userId: req.user.id,
      deviceToken,
      platform: platform || "android",
      deviceName: deviceName || "Android Device",
    });

    return res.json({
      success: true,
      message: "Device token registered successfully",
      data: tokenRecord,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const unregisterDeviceToken = async (req, res) => {
  try {
    const { deviceToken } = req.body;
    if (!deviceToken) {
      return res.status(400).json({ success: false, message: "deviceToken is required" });
    }

    await pushService.unregisterDeviceToken(deviceToken);
    return res.json({ success: true, message: "Device token deactivated" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getPreferences = async (req, res) => {
  try {
    const preferences = await notificationService.getUserPreferences(req.user.id);
    return res.json({ success: true, data: preferences });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updatePreferences = async (req, res) => {
  try {
    const preferences = await notificationService.updateUserPreferences(req.user.id, req.body);
    return res.json({
      success: true,
      message: "Notification preferences updated successfully",
      data: preferences,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const sendTestNotification = async (req, res) => {
  try {
    const {
      type = "ASSIGNMENT_APPROVAL",
      title = "Assignment Approved",
      message = "Your mentor has approved your 'Deep Learning Foundations' assignment with Grade A.",
      targetRoute = "/dashboard/assignments",
    } = req.body;

    const notification = await notificationService.createNotification({
      recipient: req.user.id,
      sender: req.user.id,
      type,
      title,
      message,
      targetRoute,
      priority: "high",
      data: {
        testedBy: req.user.name,
        timestamp: new Date().toISOString(),
      },
    });

    return res.json({
      success: true,
      message: "Multi-channel test notification dispatched across Push, Email, and In-App.",
      data: notification,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  registerDeviceToken,
  unregisterDeviceToken,
  getPreferences,
  updatePreferences,
  sendTestNotification,
};
