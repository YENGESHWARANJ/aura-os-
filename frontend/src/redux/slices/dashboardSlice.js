import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
    name: "dashboard",

    initialState: {
        data: null,
        loading: false,
        error: null,
    },

    reducers: {
        setDashboardData: (state, action) => {
            state.data = action.payload;
        },

        setDashboardLoading: (state, action) => {
            state.loading = action.payload;
        },

        setDashboardError: (state, action) => {
            state.error = action.payload;
        },

        clearDashboard: (state) => {
            state.data = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export const {
    setDashboardData,
    setDashboardLoading,
    setDashboardError,
    clearDashboard,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;