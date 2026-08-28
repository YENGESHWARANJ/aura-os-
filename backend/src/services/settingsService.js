const UserSettings = require("../models/UserSettings");

const ALLOWED_FIELDS = [
  "theme",
  "accentColor",
  "language",
  "timezone",
  "dateFormat",
  "timeFormat",
  "notificationPreferences",
  "privacyPreferences",
];

/**
 * Get settings for a user — creates default document if first time.
 */
exports.getSettings = async (userId) => {
  let settings = await UserSettings.findOne({ userId }).lean();
  if (!settings) {
    // Create default settings on first access
    const created = await UserSettings.create({ userId });
    settings = created.toObject();
  }
  return settings;
};

/**
 * Update settings — allowlist protected, securityAlerts always forced true.
 */
exports.updateSettings = async (userId, data) => {
  const updatePayload = {};

  ALLOWED_FIELDS.forEach((key) => {
    if (data[key] !== undefined) {
      if (key === "notificationPreferences") {
        // Security alerts cannot be disabled
        updatePayload[key] = {
          ...data[key],
          securityAlerts: true,
        };
      } else {
        updatePayload[key] = data[key];
      }
    }
  });

  const settings = await UserSettings.findOneAndUpdate(
    { userId },
    { $set: updatePayload },
    { new: true, upsert: true }
  ).lean();

  return settings;
};
