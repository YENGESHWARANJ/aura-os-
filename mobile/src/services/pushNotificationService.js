import { Platform } from "react-native";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import notificationApi from "../api/services/notificationApi";

// Detect Expo Go environment safely without importing ExecutionEnvironment
// In Expo Go, __DEV__ is true and appOwnership will be "expo"
let isExpoGo = false;
try {
  const Constants = require("expo-constants").default;
  isExpoGo =
    Constants?.appOwnership === "expo" ||
    Constants?.executionEnvironment === "storeClient";
} catch (e) {
  // If expo-constants fails, assume Expo Go for safety
  isExpoGo = true;
}

// Only load expo-notifications if NOT in Expo Go (SDK 53+: removed from Expo Go)
let Notifications = null;
if (!isExpoGo) {
  try {
    Notifications = require("expo-notifications");
    if (Notifications?.setNotificationHandler) {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
        }),
      });
    }
  } catch (e) {
    console.log("[PushNotification] expo-notifications unavailable:", e.message);
    Notifications = null;
  }
} else {
  console.log("[PushNotification] Expo Go detected — native push notifications disabled.");
}

/**
 * Registers device for push notifications.
 * In Expo Go, returns a simulated token so backend registration still works.
 */
export async function registerForPushNotificationsAsync() {
  let token = null;

  try {
    // In Expo Go or when notifications module unavailable, use simulated token
    if (isExpoGo || !Notifications) {
      const devToken = `ExponentPushToken[expo-go-${Platform.OS}-${Date.now()}]`;
      await AsyncStorage.setItem("aura_push_token", devToken);
      await notificationApi
        .registerDeviceToken({
          deviceToken: devToken,
          platform: Platform.OS,
          deviceName: Device.modelName || `${Platform.OS} Expo Go`,
        })
        .catch(() => {});
      return devToken;
    }

    // Android notification channel setup
    if (Platform.OS === "android" && Notifications.setNotificationChannelAsync) {
      await Notifications.setNotificationChannelAsync("academic_alerts", {
        name: "Academic Alerts & Updates",
        description: "Priority notifications for assignments, attendance warnings, and mentor guidance.",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#06b6d4",
        sound: "default",
        enableVibrate: true,
        showBadge: true,
      });
    }

    // Must be physical device for real push tokens
    if (!Device.isDevice) {
      const devToken = `ExponentPushToken[dev-emulator-${Date.now()}]`;
      await AsyncStorage.setItem("aura_push_token", devToken);
      await notificationApi.registerDeviceToken({
        deviceToken: devToken,
        platform: Platform.OS,
        deviceName: Device.modelName || `${Platform.OS} Simulator`,
      });
      return devToken;
    }

    // Request permission
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return null;

    // Get push token
    const tokenData = await Notifications.getExpoPushTokenAsync().catch((err) => {
      return { data: `ExponentPushToken[local-${Date.now()}]` };
    });
    token = tokenData?.data;

    if (token) {
      await AsyncStorage.setItem("aura_push_token", token);
      await notificationApi.registerDeviceToken({
        deviceToken: token,
        platform: Platform.OS,
        deviceName: Device.modelName || `${Platform.OS} Device`,
      });
    }
  } catch (error) {
    console.warn("[PushNotification] Registration error (non-fatal):", error.message || error);
  }

  return token;
}

/**
 * Deactivates device token on user logout
 */
export async function unregisterPushTokenAsync() {
  try {
    const token = await AsyncStorage.getItem("aura_push_token");
    if (token) {
      await notificationApi.unregisterDeviceToken(token).catch(() => {});
      await AsyncStorage.removeItem("aura_push_token");
    }
  } catch (_) {}
}

/**
 * Sets up notification listeners for foreground & tap events.
 * Safely no-ops in Expo Go.
 */
export function setupNotificationListeners(navigation, role = "student") {
  if (isExpoGo || !Notifications?.addNotificationReceivedListener) {
    return () => {};
  }

  const resolveScreenForRoute = (rawRoute) => {
    const route = String(rawRoute || "").trim();
    const normalizedRole = String(role || "student").toLowerCase();
    const homeTab = normalizedRole === "student"
      ? "HomeTab"
      : normalizedRole === "faculty"
        ? "FacultyHomeTab"
        : normalizedRole === "mentor"
          ? "MentorHomeTab"
          : normalizedRole === "parent"
            ? "ParentHomeTab"
            : "AdminHomeTab";

    if (!route) {
      return normalizedRole === "parent"
        ? { tab: "NotificationsTab" }
        : { tab: homeTab, screen: "Notifications" };
    }

    if (route.includes("assignment") && normalizedRole === "student") {
      return { tab: "AssignmentsTab" };
    }
    if (route.includes("attendance")) return { tab: "AttendanceTab" };
    if (route.includes("evidence") || route.includes("intervention")) {
      return { tab: "ProfileTab" };
    }
    if (route.includes("mentor") || route.includes("message") || route.includes("announcement") || route.includes("system")) {
      return { tab: homeTab };
    }
    return normalizedRole === "parent"
      ? { tab: "NotificationsTab" }
      : { tab: homeTab, screen: "Notifications" };
  };

  try {
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("[PushNotification] Received:", notification.request.content.title);
      }
    );

    const responseListener = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;
        if (data?.targetRoute && navigation?.navigate) {
          const destination = resolveScreenForRoute(data.targetRoute);
          navigation.navigate(
            destination.tab,
            destination.screen ? { screen: destination.screen } : undefined
          );
        } else if (navigation?.navigate) {
          const destination = resolveScreenForRoute("");
          navigation.navigate(
            destination.tab,
            destination.screen ? { screen: destination.screen } : undefined
          );
        }
      }
    );

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  } catch (e) {
    return () => {};
  }
}
