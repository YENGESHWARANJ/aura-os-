const mongoose = require("mongoose");

const AIMessageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AIConversation",
      required: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    intent: {
      type: String,
      default: "GENERAL_CHAT",
    },
    type: {
      type: String,
      default: "text",
    },
    actions: [
      {
        label: String,
        route: String,
        actionType: String,
        payload: mongoose.Schema.Types.Mixed,
      },
    ],
    cards: [
      {
        title: String,
        badge: String,
        description: String,
        status: String,
      },
    ],
    sourcesUsed: [String],
    feedback: {
      type: String,
      enum: ["helpful", "unhelpful", null],
      default: null,
    },
  },
  { timestamps: true }
);

AIMessageSchema.index({ conversation: 1, createdAt: 1 });

module.exports = mongoose.model("AIMessage", AIMessageSchema);
