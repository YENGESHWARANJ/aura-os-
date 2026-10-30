const axios = require("axios");
const DeviceToken = require("../models/DeviceToken");

const EXPO_PUSH_API_URL = "https://exp.host/--/api/v2/push/send";

/**
 * Checks if a token is a valid Expo push token format
 */
const isExpoPushToken = (token) => {
  return (
    typeof token === "string" &&
    (token.startsWith("ExponentPushToken[") || token.startsWith("ExpoPushToken["))
  );
};

/**
 * Sends a push notification to all active devices of a user
 * @param {Object} params
 * @param {string} params.userId - Target user ID
 * @param {string} params.title - Push notification title
 * @param {string} params.body - Push notification message body
 * @param {string} [params.targetRoute] - Deep link route (e.g. /dashboard/assignments)
 * @param {string} [params.notificationId] - MongoDB Notification ID
 * @param {Object} [params.data] - Extra payload metadata
 * @returns {Promise<{ success: boolean, sentCount: number, error?: string }>}
 */
const sendPushNotification = async ({
  userId,
  title,
  body,
  targetRoute = "/dashboard/notifications",
  notificationId = null,
  data = {},
}) => {
  if (!userId) {
    return { success: false, sentCount: 0, error: "Missing userId" };
  }

  try {
    // 1. Fetch all active device tokens for the user
    const tokens = await DeviceToken.find({ userId, isActive: true }).lean();
    if (!tokens || tokens.length === 0) {
      return { success: true, sentCount: 0, status: "no_active_tokens" };
    }

    // Filter valid Expo push tokens
    const validTokens = tokens.filter((t) => isExpoPushToken(t.deviceToken));
    if (validTokens.length === 0) {
      return { success: true, sentCount: 0, status: "no_valid_expo_tokens" };
    }

    // 2. Prepare Expo push messages
    const messages = validTokens.map((t) => ({
      to: t.deviceToken,
      sound: "default",
      title: title || "AURA OS Notification",
      body: body || "",
      priority: "high",
      channelId: "academic_alerts", // Android notification channel
      vibrate: [0, 250, 250, 250],
      data: {
        ...data,
        targetRoute,
        notificationId: notificationId ? String(notificationId) : null,
        timestamp: Date.now(),
      },
    }));

    // 3. Send messages to Expo push notification gateway
    const response = await axios.post(EXPO_PUSH_API_URL, messages, {
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    // 4. Inspect receipts / tickets to cleanup invalid or unregistered tokens
    const tickets = response.data?.data || [];
    let sentCount = 0;

    for (let i = 0; i < tickets.length; i++) {
      const ticket = tickets[i];
      const target = validTokens[i];

      if (ticket.status === "ok") {
        sentCount++;
        // Update lastUsedAt
        await DeviceToken.updateOne(
          { _id: target._id },
          { lastUsedAt: new Date() }
        ).catch(() => {});
      } else if (
        ticket.status === "error" &&
        ticket.details?.error === "DeviceNotRegistered"
      ) {
        // Automatically deactivate dead tokens
        console.warn(`[PushNotification] Deactivating invalid token for user ${userId}`);
        await DeviceToken.updateOne(
          { _id: target._id },
          { isActive: false }
        ).catch(() => {});
      }
    }

    return {
      success: true,
      sentCount,
      totalDevices: validTokens.length,
    };
  } catch (error) {
    console.error("[PushNotification] Error sending push notification:", error.message);
    return {
      success: false,
      sentCount: 0,
      error: error.message,
    };
  }
};

/**
 * Registers or refreshes a device push token for a user
 */
const registerDeviceToken = async ({ userId, deviceToken, platform = "android", deviceName = "Android Device" }) => {
  if (!userId || !deviceToken) {
    throw new Error("userId and deviceToken are required.");
  }

  const record = await DeviceToken.findOneAndUpdate(
    { deviceToken },
    {
      userId,
      platform,
      deviceName,
      isActive: true,
      lastUsedAt: new Date(),
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return record;
};

/**
 * Deactivates a device push token on user logout
 */
const unregisterDeviceToken = async (deviceToken) => {
  if (!deviceToken) return null;
  return DeviceToken.findOneAndUpdate(
    { deviceToken },
    { isActive: false, lastUsedAt: new Date() },
    { new: true }
  );
};

module.exports = {
  sendPushNotification,
  registerDeviceToken,
  unregisterDeviceToken,
  isExpoPushToken,
};
