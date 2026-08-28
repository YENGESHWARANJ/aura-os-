const notificationService = require("../services/notificationService");

const getNotifications = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;
  const onlyUnread = req.query.onlyUnread === "true";

  const data = await notificationService.getNotificationsForUser(req.user.id, req.user.role, {
    page,
    limit,
    onlyUnread,
  });
  return res.json({ success: true, data });
};

const getUnreadCount = async (req, res) => {
  const count = await notificationService.getUnreadCount(req.user.id, req.user.role);
  return res.json({ success: true, data: { count } });
};

const markAsRead = async (req, res) => {
  const notification = await notificationService.markAsRead(req.user.id, req.user.role, req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found or unauthorized." });
  }
  return res.json({ success: true, data: notification });
};

const markAllAsRead = async (req, res) => {
  const result = await notificationService.markAllAsRead(req.user.id, req.user.role);
  return res.json({ success: true, data: { modifiedCount: result.modifiedCount } });
};

const deleteNotification = async (req, res) => {
  const notification = await notificationService.deleteNotification(req.user.id, req.user.role, req.params.id);
  if (!notification) {
    return res.status(404).json({ success: false, message: "Notification not found or unauthorized." });
  }
  return res.json({ success: true, data: notification });
};

module.exports = {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
