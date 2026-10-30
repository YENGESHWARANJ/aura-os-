const notificationService = require("./notificationService");

const buildAlertPayload = ({
  type,
  title,
  message,
  targetRoute = "/dashboard/notifications",
  recipient,
  roles = [],
  senderId = null,
  priority = "medium",
  data = {},
  idempotencyKey = null,
}) => ({
  type,
  title,
  message,
  targetRoute,
  recipient,
  roles,
  senderId,
  priority,
  data,
  idempotencyKey,
});

const createAlertNotification = async (payload) => {
  const alert = buildAlertPayload(payload);
  return notificationService.createNotification(alert);
};

const scheduleAcademicReminder = async ({
  userId,
  type = "ASSIGNMENT_DUE",
  title,
  message,
  targetRoute = "/dashboard/assignments",
  delayMs = 0,
}) => {
  const queueService = require("./notificationQueue");

  return queueService.scheduleNotificationCreation({
    delayMs,
    payload: {
      recipient: userId,
      type,
      title: title || "Academic reminder",
      message: message || "A reminder from your AURA OS academic timeline.",
      targetRoute,
      priority: "medium",
      data: { reminder: true },
    },
  });
};

module.exports = {
  buildAlertPayload,
  createAlertNotification,
  scheduleAcademicReminder,
};