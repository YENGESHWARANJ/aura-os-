const mongoose = require("mongoose");

const UserSettingsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    // Appearance
    theme: {
      type: String,
      enum: ["dark", "light", "system"],
      default: "dark",
    },
    accentColor: {
      type: String,
      enum: ["blue", "purple", "cyan", "green"],
      default: "blue",
    },
    // Localization
    language: {
      type: String,
      default: "en",
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    dateFormat: {
      type: String,
      enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"],
      default: "DD/MM/YYYY",
    },
    timeFormat: {
      type: String,
      enum: ["12h", "24h"],
      default: "12h",
    },
    // Notification Preferences
    notificationPreferences: {
      academic: { type: Boolean, default: true },
      assignments: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      exams: { type: Boolean, default: true },
      mentorMessages: { type: Boolean, default: true },
      aiRecommendations: { type: Boolean, default: true },
      systemNotifications: { type: Boolean, default: true },
      securityAlerts: { type: Boolean, default: true }, // Always true
    },
    // Privacy Preferences
    privacyPreferences: {
      profileVisibility: { type: Boolean, default: true },
      activityVisibility: { type: Boolean, default: true },
      aiDataUsage: { type: Boolean, default: true },
      personalization: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("UserSettings", UserSettingsSchema);
