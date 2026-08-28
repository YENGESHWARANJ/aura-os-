const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    roles: [
      {
        type: String,
        enum: ["student", "faculty", "mentor", "parent", "admin", "super-admin"],
      },
    ],
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    type: {
      type: String,
      enum: [
        "ATTENDANCE_WARNING",
        "ASSIGNMENT_CREATED",
        "ASSIGNMENT_DUE",
        "MARKS_UPDATED",
        "EXAM_REMINDER",
        "MENTOR_MEETING",
        "MENTOR_MESSAGE",
        "PROJECT_UPDATE",
        "CERTIFICATE_UPDATE",
        "PLACEMENT_ALERT",
        "CAREER_RECOMMENDATION",
        "RISK_ALERT",
        "ADMIN_ANNOUNCEMENT",
        "SYSTEM_NOTIFICATION",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      default: "medium",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ roles: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
