const mongoose = require("mongoose");

const AIConversationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Academic Chat",
      trim: true,
    },
    mode: {
      type: String,
      enum: ["auto", "study", "coding", "career", "research"],
      default: "auto",
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

AIConversationSchema.index({ user: 1, updatedAt: -1 });

module.exports = mongoose.model("AIConversation", AIConversationSchema);
