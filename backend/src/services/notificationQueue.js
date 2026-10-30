const { Queue, Worker } = require("bullmq");
const { getRedisClient } = require("../config/redis/redis");

let notificationQueue = null;
let notificationWorker = null;

const getNotificationQueue = () => {
  const connection = getRedisClient();

  if (!connection) {
    return null;
  }

  if (!notificationQueue) {
    notificationQueue = new Queue("aura-notification-jobs", {
      connection,
      defaultJobOptions: {
        removeOnComplete: true,
        removeOnFail: true,
      },
    });
  }

  return notificationQueue;
};

const initializeNotificationQueueProcessor = async () => {
  const connection = getRedisClient();
  if (!connection) return null;

  if (notificationWorker) return notificationWorker;

  notificationWorker = new Worker(
    "aura-notification-jobs",
    async (job) => {
      const eventBus = require("../events/eventBus");

      if (job.data?.payload) {
        const notificationService = require("./notificationService");
        const notification = await notificationService.createNotification({
          ...job.data.payload,
          queueDispatch: false,
        });
        return { ok: true, notificationId: notification?._id?.toString?.() };
      }

      const { notification } = job.data || {};
      if (!notification) return;

      eventBus.emit("notification.created", notification);
      return { ok: true, notificationId: notification._id?.toString?.() || notification.id };
    },
    { connection }
  );

  notificationWorker.on("failed", (job, error) => {
    console.warn("[NotificationQueue] Job failed:", job?.name, error?.message || error);
  });

  return notificationWorker;
};

const enqueueNotificationDispatch = async (notification, options = {}) => {
  const queue = getNotificationQueue();
  if (!queue) {
    return { queued: false, reason: "redis_unavailable" };
  }

  const delayMs = Number(options.delayMs || 0);
  const job = await queue.add(
    "deliver-notification",
    { notification },
    {
      delay: delayMs,
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    }
  );

  return { queued: true, jobId: job.id };
};

const scheduleNotificationDelivery = async ({ notification, delayMs = 0, scheduleFor = null }) => {
  const queue = getNotificationQueue();
  if (!queue) {
    return { queued: false, reason: "redis_unavailable" };
  }

  const actualDelay = delayMs || (scheduleFor ? new Date(scheduleFor).getTime() - Date.now() : 0);
  const job = await queue.add(
    "deliver-notification",
    { notification },
    {
      delay: Math.max(0, actualDelay),
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    }
  );

  return { queued: true, jobId: job.id };
};

const scheduleNotificationCreation = async ({ payload, delayMs = 0, scheduleFor = null }) => {
  const queue = getNotificationQueue();
  if (!queue) {
    return { queued: false, reason: "redis_unavailable" };
  }

  const actualDelay = delayMs || (scheduleFor ? new Date(scheduleFor).getTime() - Date.now() : 0);
  const job = await queue.add(
    "create-notification",
    { payload },
    {
      delay: Math.max(0, actualDelay),
      attempts: 3,
      backoff: { type: "exponential", delay: 2000 },
    }
  );

  return { queued: true, jobId: job.id };
};

module.exports = {
  getNotificationQueue,
  initializeNotificationQueueProcessor,
  enqueueNotificationDispatch,
  scheduleNotificationDelivery,
  scheduleNotificationCreation,
};