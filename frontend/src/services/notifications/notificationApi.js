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
