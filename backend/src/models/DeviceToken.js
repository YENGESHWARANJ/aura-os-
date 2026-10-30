const mongoose = require("mongoose");

const DeviceTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    deviceToken: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    platform: {
      type: String,
      enum: ["android", "ios", "web"],
      default: "android",
    },
    deviceName: {
      type: String,
      trim: true,
      default: "Android Device",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

DeviceTokenSchema.index({ userId: 1, isActive: 1 });
DeviceTokenSchema.index({ deviceToken: 1, isActive: 1 });

module.exports = mongoose.model("DeviceToken", DeviceTokenSchema);
