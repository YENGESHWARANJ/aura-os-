const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    // Alias / backward-compatible field for recipient
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
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
    // Alias / backward-compatible field for sender
    senderId: {
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
        "ASSIGNMENT_SUBMISSION",
        "ASSIGNMENT_EVALUATION",
        "ASSIGNMENT_APPROVAL",
        "ASSIGNMENT_REJECTION",
        "MARKS_UPDATED",
        "EXAM_REMINDER",
        "MENTOR_MEETING",
        "MENTOR_MESSAGE",
        "PROJECT_UPDATE",
        "PROJECT_APPROVAL",
        "PROJECT_REJECTION",
        "CERTIFICATE_UPDATE",
        "EVIDENCE_VERIFICATION",
        "INTERVENTION_RECOMMENDATION",
        "CURRICULUM_RECOMMENDATION",
        "PLACEMENT_ALERT",
        "CAREER_RECOMMENDATION",
        "RISK_ALERT",
        "ADMIN_ANNOUNCEMENT",
        "SYSTEM_NOTIFICATION",
        "SYSTEM_ANNOUNCEMENT",
        // Lowercase convenience types
        "attendance",
        "assignment",
        "grade",
        "mentor",
        "system",
        "warning",
        "project",
        "evidence",
      ],
      required: true,
      index: true,
    },
    notificationType: {
      type: String,
      default: null,
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
    // Deep linking route (e.g., /dashboard/assignments, /dashboard/evidence-wallet)
    targetRoute: {
      type: String,
      default: "/dashboard/notifications",
      trim: true,
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    relatedEntityType: {
      type: String,
      default: null,
      trim: true,
    },
    // Multi-channel delivery statuses
    inAppStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed"],
      default: "sent",
    },
    pushStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed", "not_applicable"],
      default: "pending",
    },
    emailStatus: {
      type: String,
      enum: ["pending", "sent", "delivered", "failed", "not_applicable"],
      default: "pending",
    },
    // Idempotency key for preventing duplicates
    idempotencyKey: {
      type: String,
      sparse: true,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
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

// Pre-save hook to synchronize aliases
NotificationSchema.pre("save", function () {
  if (this.recipient && !this.receiverId) {
    this.receiverId = this.recipient;
  } else if (this.receiverId && !this.recipient) {
    this.recipient = this.receiverId;
  }

  if (this.sender && !this.senderId) {
    this.senderId = this.sender;
  } else if (this.senderId && !this.sender) {
    this.sender = this.senderId;
  }

  if (this.type && !this.notificationType) {
    this.notificationType = this.type;
  } else if (this.notificationType && !this.type) {
    this.type = this.notificationType;
  }
});

NotificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ receiverId: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ roles: 1, isRead: 1, createdAt: -1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Notification", NotificationSchema);
