import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
    setUnreadCount: (state, action) => {
      state.unreadCount = action.payload;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    },
    updateNotification: (state, action) => {
      const updated = action.payload;
      const index = state.notifications.findIndex((item) => item._id === updated._id);
      if (index !== -1) {
        state.notifications[index] = updated;
      }
      if (updated.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
      state.error = null;
    },
    setNotificationError: (state, action) => {
      state.error = action.payload;
    },
    setNotificationLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setNotifications,
  setUnreadCount,
  addNotification,
  updateNotification,
  clearNotifications,
  setNotificationError,
  setNotificationLoading,
} = notificationSlice.actions;

export default notificationSlice.reducer;
