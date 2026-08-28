import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import dashboardReducer from "./slices/dashboardSlice";
import notificationReducer from "./slices/notificationSlice";
import studentReducer from "./slices/studentSlice";
import themeReducer from "./slices/themeSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        notifications: notificationReducer,
        student: studentReducer,
        theme: themeReducer,
    },
});

export default store;