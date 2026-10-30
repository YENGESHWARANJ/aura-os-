const mongoose = require("mongoose");

const NotificationPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    channels: {
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: true },
      inApp: { type: Boolean, default: true },
    },
    categories: {
      assignments: { type: Boolean, default: true },
      attendance: { type: Boolean, default: true },
      marks: { type: Boolean, default: true },
      messages: { type: Boolean, default: true },
      projects: { type: Boolean, default: true },
      evidence: { type: Boolean, default: true },
      interventions: { type: Boolean, default: true },
      curriculum: { type: Boolean, default: true },
      announcements: { type: Boolean, default: true },
      security: { type: Boolean, default: true }, // Cannot be disabled
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("NotificationPreference", NotificationPreferenceSchema);
