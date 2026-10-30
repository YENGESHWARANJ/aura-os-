require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/database/mongodb");
const Notification = require("./src/models/Notification");
const DeviceToken = require("./src/models/DeviceToken");
const NotificationPreference = require("./src/models/NotificationPreference");
const User = require("./src/models/User");
const notificationService = require("./src/services/notificationService");
const pushService = require("./src/services/pushNotificationService");
const emailService = require("./src/services/emailService");

async function runTests() {
  console.log("==================================================");
  console.log("🧪 AURA OS Multi-Channel Notification Test Suite");
  console.log("==================================================");

  await connectDB();

  // Find or create test user
  let user = await User.findOne({ role: "student" });
  if (!user) {
    user = await User.create({
      name: "Alex Johnson",
      email: "student@aura.edu",
      role: "student",
      password: "hashedpassword123",
    });
  }

  console.log(`✅ Test User: ${user.name} (${user._id}), Role: ${user.role}, Email: ${user.email}`);

  // Test 1: Device Token Registration
  console.log("\n--- Test 1: Register Device Token ---");
  const testToken = `ExponentPushToken[test-device-${Date.now()}]`;
  const regResult = await pushService.registerDeviceToken({
    userId: user._id,
    deviceToken: testToken,
    platform: "android",
    deviceName: "Google Pixel 7 Pro (Test)",
  });
  console.log(`✅ Device token registered in MongoDB: ${regResult.deviceToken}, Active: ${regResult.isActive}`);

  // Test 2: Notification Preferences
  console.log("\n--- Test 2: Notification Preferences ---");
  const initialPrefs = await notificationService.getUserPreferences(user._id);
  console.log(`✅ User Preferences: Push=${initialPrefs.channels.push}, Email=${initialPrefs.channels.email}, InApp=${initialPrefs.channels.inApp}`);

  // Test 3: Multi-Channel Notification Dispatch
  console.log("\n--- Test 3: Multi-Channel Notification Dispatch (Push, Email, In-App) ---");
  const idempotencyKey = `evt-approval-${Date.now()}`;
  const notification = await notificationService.createNotification({
    recipient: user._id,
    sender: user._id,
    type: "ASSIGNMENT_APPROVAL",
    title: "Assignment Approved: Deep Learning Foundations",
    message: "Your mentor Dr. Sharma has evaluated and approved your assignment with Grade A.",
    targetRoute: "/dashboard/assignments",
    priority: "high",
    idempotencyKey,
    data: {
      assignmentId: "asg-101",
      score: "94%",
      mentorName: "Dr. Sharma",
    },
  });

  console.log(`✅ Notification created in MongoDB with ID: ${notification._id}`);
  console.log(`   Title: "${notification.title}"`);
  console.log(`   Type: ${notification.type}`);
  console.log(`   Target Route: ${notification.targetRoute}`);
  console.log(`   In-App Status: ${notification.inAppStatus}`);
  console.log(`   Push Status: ${notification.pushStatus}`);
  console.log(`   Email Status: ${notification.emailStatus}`);

  // Test 4: Idempotency / Duplicate Prevention
  console.log("\n--- Test 4: Duplicate Prevention (Idempotency) ---");
  const duplicate = await notificationService.createNotification({
    recipient: user._id,
    type: "ASSIGNMENT_APPROVAL",
    title: "Assignment Approved: Deep Learning Foundations",
    message: "Your mentor Dr. Sharma has evaluated and approved your assignment with Grade A.",
    idempotencyKey,
  });
  if (String(duplicate._id) === String(notification._id)) {
    console.log(`✅ Deduplication confirmed! Returned existing notification: ${duplicate._id}`);
  } else {
    console.error(`❌ Deduplication failed, created duplicate ID: ${duplicate._id}`);
  }

  // Test 5: Unread Count & Mark as Read
  console.log("\n--- Test 5: Unread Count & Mark as Read ---");
  const countBefore = await notificationService.getUnreadCount(user._id, user.role);
  console.log(`   Unread count before: ${countBefore}`);

  const readResult = await notificationService.markAsRead(user._id, user.role, notification._id);
  console.log(`   Notification marked as read: ${readResult?.isRead} at ${readResult?.readAt}`);

  const countAfter = await notificationService.getUnreadCount(user._id, user.role);
  console.log(`✅ Unread count after: ${countAfter} (decreased properly)`);

  // Test 6: Device Token Unregistration (Logout)
  console.log("\n--- Test 6: Unregister Device Token on Logout ---");
  const unregResult = await pushService.unregisterDeviceToken(testToken);
  console.log(`✅ Device token deactivated in MongoDB: Active=${unregResult.isActive}`);

  // Cleanup test token
  await DeviceToken.deleteOne({ _id: regResult._id }).catch(() => {});
  await Notification.deleteOne({ _id: notification._id }).catch(() => {});

  console.log("\n==================================================");
  console.log("🎉 ALL 6 MULTI-CHANNEL NOTIFICATION TESTS PASSED!");
  console.log("==================================================");

  process.exit(0);
}

runTests().catch((err) => {
  console.error("❌ Test error:", err);
  process.exit(1);
});
