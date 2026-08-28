const Notification = require("../models/Notification");
const eventBus = require("../events/eventBus");

const NOTIFICATION_DEDUPE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

const createNotification = async ({ recipient, roles = [], sender, type, title, message, data = {}, priority = "medium" }) => {
  if (!recipient && (!Array.isArray(roles) || roles.length === 0)) {
    throw new Error("Notification must target a recipient or a role.");
  }

  const duplicateQuery = {
    recipient: recipient || null,
    roles: roles.length > 0 ? roles : undefined,
    type,
    title,
    message,
    createdAt: { $gte: new Date(Date.now() - NOTIFICATION_DEDUPE_WINDOW_MS) },
  };

  const existing = await Notification.findOne(duplicateQuery).lean();
  if (existing) {
    return existing;
  }

  const notification = await Notification.create({
    recipient,
    roles,
    sender,
    type,
    title,
    message,
    data,
    priority,
    isRead: false,
  });

  eventBus.emit("notification.created", notification);

  return notification;
};

const getNotificationsForUser = async (userId, userRole, { page = 1, limit = 20, onlyUnread = false } = {}) => {
  const query = {
    $or: [
      { recipient: userId },
      ...(userRole ? [{ roles: userRole }] : []),
    ],
  };

  if (onlyUnread) {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();

  const total = await Notification.countDocuments(query);

  return {
    notifications,
    page,
    limit,
    total,
  };
};

const getUnreadCount = async (userId, userRole) => {
  const query = {
    $or: [
      { recipient: userId },
      ...(userRole ? [{ roles: userRole }] : []),
    ],
    isRead: false,
  };

  const count = await Notification.countDocuments(query);
  return count;
};

const markAsRead = async (userId, userRole, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      $or: [{ recipient: userId }, ...(userRole ? [{ roles: userRole }] : [])],
    },
    { isRead: true, readAt: new Date() },
    { new: true }
  ).lean();

  return notification;
};

const markAllAsRead = async (userId, userRole) => {
  const result = await Notification.updateMany(
    {
      $or: [{ recipient: userId }, ...(userRole ? [{ roles: userRole }] : [])],
      isRead: false,
    },
    { isRead: true, readAt: new Date() }
  );

  return result;
};

const deleteNotification = async (userId, userRole, notificationId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    $or: [{ recipient: userId }, ...(userRole ? [{ roles: userRole }] : [])],
  });

  return notification;
};

module.exports = {
  createNotification,
  getNotificationsForUser,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
