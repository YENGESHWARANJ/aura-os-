import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    theme: "dark",
};

const themeSlice = createSlice({
    name: "theme",

    initialState,

    reducers: {
        setTheme: (state, action) => {
            state.theme = action.payload;
        },

        toggleTheme: (state) => {
            state.theme = state.theme === "dark" ? "light" : "dark";
        },

        resetTheme: (state) => {
            state.theme = "dark";
        },
    },
});

export const {
    setTheme,
    toggleTheme,
    resetTheme,
} = themeSlice.actions;

export default themeSlice.reducer;