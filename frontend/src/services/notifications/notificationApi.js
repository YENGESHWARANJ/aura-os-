import api from "../api";

export const getNotifications = ({ page = 1, limit = 20, onlyUnread = false } = {}) => {
  return api.get("/notifications", {
    params: { page, limit, onlyUnread },
  });
};

export const getUnreadCount = () => {
  return api.get("/notifications/unread-count");
};

export const markNotificationAsRead = (notificationId) => {
  return api.patch(`/notifications/${notificationId}/read`);
};

export const markAllNotificationsAsRead = () => {
  return api.patch("/notifications/mark-all-read");
};

export const deleteNotification = (notificationId) => {
  return api.delete(`/notifications/${notificationId}`);
};

// Multi-Channel Notification APIs
export const registerDeviceToken = (payload) => {
  return api.post("/notifications/device-token/register", payload);
};

export const unregisterDeviceToken = (deviceToken) => {
  return api.post("/notifications/device-token/unregister", { deviceToken });
};

export const getNotificationPreferences = () => {
  return api.get("/notifications/preferences");
};

export const updateNotificationPreferences = (preferences) => {
  return api.put("/notifications/preferences", preferences);
};

export const sendTestNotification = (payload = {}) => {
  return api.post("/notifications/send-test", payload);
};
