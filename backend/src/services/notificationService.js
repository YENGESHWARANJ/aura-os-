const Notification = require("../models/Notification");
const NotificationPreference = require("../models/NotificationPreference");
const User = require("../models/User");
const eventBus = require("../events/eventBus");
const { sendPushNotification } = require("./pushNotificationService");
const { sendEmailNotification } = require("./emailService");
const { enqueueNotificationDispatch } = require("./notificationQueue");

const NOTIFICATION_DEDUPE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Maps notification types to user preference category keys
 */
const getCategoryKey = (type = "") => {
  const t = type.toLowerCase();
  if (t.includes("assignment")) return "assignments";
  if (t.includes("attendance")) return "attendance";
  if (t.includes("mark") || t.includes("grade")) return "marks";
  if (t.includes("message") || t.includes("meeting")) return "messages";
  if (t.includes("project")) return "projects";
  if (t.includes("evidence") || t.includes("certificate")) return "evidence";
  if (t.includes("intervention") || t.includes("risk")) return "interventions";
  if (t.includes("curriculum")) return "curriculum";
  if (t.includes("announcement")) return "announcements";
  return "security";
};

/**
 * Gets or creates default notification preferences for a user
 */
const getUserPreferences = async (userId) => {
  let prefs = await NotificationPreference.findOne({ userId }).lean();
  if (!prefs) {
    prefs = await NotificationPreference.create({
      userId,
      channels: { push: true, email: true, inApp: true },
      categories: {
        assignments: true,
        attendance: true,
        marks: true,
        messages: true,
        projects: true,
        evidence: true,
        interventions: true,
        curriculum: true,
        announcements: true,
        security: true,
      },
    });
    prefs = prefs.toObject();
  }
  return prefs;
};

/**
 * Updates notification preferences for a user
 */
const updateUserPreferences = async (userId, updateData) => {
  const current = await getUserPreferences(userId);

  const updatedChannels = {
    ...current.channels,
    ...(updateData.channels || {}),
  };

  const updatedCategories = {
    ...current.categories,
    ...(updateData.categories || {}),
    security: true, // Security alerts can never be disabled
  };

  const updated = await NotificationPreference.findOneAndUpdate(
    { userId },
    { channels: updatedChannels, categories: updatedCategories },
    { new: true, upsert: true }
  ).lean();

  return updated;
};

/**
 * Master multi-channel notification creator & dispatcher
 */
const createNotification = async ({
  recipient,
  receiverId,
  roles = [],
  sender = null,
  senderId = null,
  type,
  title,
  message,
  data = {},
  priority = "medium",
  targetRoute = "/dashboard/notifications",
  relatedEntityId = null,
  relatedEntityType = null,
  idempotencyKey = null,
  queueDispatch = true,
}) => {
  const targetUserId = recipient || receiverId;
  const sourceUserId = sender || senderId;

  if (!targetUserId && (!Array.isArray(roles) || roles.length === 0)) {
    throw new Error("Notification must target a recipient or a role.");
  }

  // 1. Duplicate check (Idempotency Key or 5-minute sliding window)
  if (idempotencyKey) {
    const existingByIdempotency = await Notification.findOne({ idempotencyKey }).lean();
    if (existingByIdempotency) {
      return existingByIdempotency;
    }
  }

  const duplicateQuery = {
    recipient: targetUserId || null,
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

  // 2. Load user preferences if targeting an individual user
  let userPrefs = null;
  let userRecord = null;
  if (targetUserId) {
    [userPrefs, userRecord] = await Promise.all([
      getUserPreferences(targetUserId).catch(() => null),
      User.findById(targetUserId).select("name email role").lean().catch(() => null),
    ]);
  }

  const categoryKey = getCategoryKey(type);
  const isCategoryEnabled = userPrefs ? (userPrefs.categories?.[categoryKey] ?? true) : true;
  const isPushChannelEnabled = userPrefs ? (userPrefs.channels?.push ?? true) : true;
  const isEmailChannelEnabled = userPrefs ? (userPrefs.channels?.email ?? true) : true;
  const isInAppChannelEnabled = userPrefs ? (userPrefs.channels?.inApp ?? true) : true;

  // 3. Persist Notification record to MongoDB FIRST (Requirement: must not be considered successful unless DB record created)
  const notification = await Notification.create({
    recipient: targetUserId,
    receiverId: targetUserId,
    roles,
    sender: sourceUserId,
    senderId: sourceUserId,
    type,
    notificationType: type,
    title,
    message,
    data,
    priority,
    targetRoute: targetRoute || "/dashboard/notifications",
    relatedEntityId,
    relatedEntityType,
    idempotencyKey,
    inAppStatus: isInAppChannelEnabled ? "sent" : "pending",
    pushStatus: isPushChannelEnabled && isCategoryEnabled ? "pending" : "not_applicable",
    emailStatus: isEmailChannelEnabled && isCategoryEnabled ? "pending" : "not_applicable",
    isRead: false,
  });

  // 4. Channel 1: In-App Real-time via Socket.IO / eventBus
  if (isInAppChannelEnabled) {
    if (!queueDispatch) {
        eventBus.emit("notification.created", notification);
    } else {
      enqueueNotificationDispatch(notification)
        .then((result) => {
          if (!result.queued) eventBus.emit("notification.created", notification);
        })
        .catch(() => eventBus.emit("notification.created", notification));
    }
  }

  // 5. Channel 2: Mobile Push Notification (MAIN PRIORITY)
  if (targetUserId && isPushChannelEnabled && isCategoryEnabled) {
    sendPushNotification({
      userId: targetUserId,
      title,
      body: message,
      targetRoute,
      notificationId: notification._id,
      data: {
        type,
        relatedEntityId,
        relatedEntityType,
      },
    })
      .then(async (pushResult) => {
        const pushStatus = pushResult.success ? "sent" : "failed";
        await Notification.updateOne({ _id: notification._id }, { pushStatus }).catch(() => {});
      })
      .catch((err) => {
        console.error("[NotificationService] Push dispatch failed:", err.message);
      });
  }

  // 6. Channel 3: Email Notification
  if (targetUserId && userRecord?.email && isEmailChannelEnabled && isCategoryEnabled) {
    sendEmailNotification({
      to: userRecord.email,
      title,
      message,
      senderName: data?.senderName || null,
      targetRoute,
      notificationType: type.replace(/_/g, " "),
    })
      .then(async (emailResult) => {
        const emailStatus = emailResult.success ? "sent" : "failed";
        await Notification.updateOne({ _id: notification._id }, { emailStatus }).catch(() => {});
      })
      .catch((err) => {
        console.error("[NotificationService] Email dispatch failed:", err.message);
      });
  }

  return notification;
};

const getNotificationsForUser = async (userId, userRole, { page = 1, limit = 20, onlyUnread = false } = {}) => {
  const query = {
    $or: [
      { recipient: userId },
      { receiverId: userId },
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
      { receiverId: userId },
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
      $or: [
        { recipient: userId },
        { receiverId: userId },
        ...(userRole ? [{ roles: userRole }] : []),
      ],
    },
    { isRead: true, readAt: new Date() },
    { new: true }
  ).lean();

  return notification;
};

const markAllAsRead = async (userId, userRole) => {
  const result = await Notification.updateMany(
    {
      $or: [
        { recipient: userId },
        { receiverId: userId },
        ...(userRole ? [{ roles: userRole }] : []),
      ],
      isRead: false,
    },
    { isRead: true, readAt: new Date() }
  );

  return result;
};

const deleteNotification = async (userId, userRole, notificationId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    $or: [
      { recipient: userId },
      { receiverId: userId },
      ...(userRole ? [{ roles: userRole }] : []),
    ],
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
  getUserPreferences,
  updateUserPreferences,
};
