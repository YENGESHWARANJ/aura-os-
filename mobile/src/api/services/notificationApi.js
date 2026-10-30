import api from "../client";

export const notificationApi = {
  getNotifications: async (params = {}) => {
    const response = await api.get("/notifications", { params });
    return response.data;
  },

  getUnreadCount: async () => {
    const response = await api.get("/notifications/unread-count");
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await api.patch(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await api.patch("/notifications/mark-all-read");
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/notifications/${id}`);
    return response.data;
  },

  // Multi-Channel Extensions
  registerDeviceToken: async ({ deviceToken, platform = "android", deviceName = "Android Device" }) => {
    const response = await api.post("/notifications/device-token/register", {
      deviceToken,
      platform,
      deviceName,
    });
    return response.data;
  },

  unregisterDeviceToken: async (deviceToken) => {
    const response = await api.post("/notifications/device-token/unregister", {
      deviceToken,
    });
    return response.data;
  },

  getPreferences: async () => {
    const response = await api.get("/notifications/preferences");
    return response.data;
  },

  updatePreferences: async (preferences) => {
    const response = await api.put("/notifications/preferences", preferences);
    return response.data;
  },

  sendTestNotification: async (payload = {}) => {
    const response = await api.post("/notifications/send-test", payload);
    return response.data;
  },
};

export default notificationApi;
