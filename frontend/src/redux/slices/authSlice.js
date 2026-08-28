import { createSlice } from "@reduxjs/toolkit";

const getStoredAuthState = () => {
  if (typeof window === "undefined") {
    return { accessToken: null, refreshToken: null, user: null, isAuthenticated: false, loading: true, error: null };
  }

  const accessToken = localStorage.getItem("accessToken") || localStorage.getItem("aura_token");
  const refreshToken = localStorage.getItem("refreshToken");
  const user = localStorage.getItem("user");

  return {
    accessToken,
    refreshToken,
    user: user ? JSON.parse(user) : null,
    isAuthenticated: Boolean(accessToken),
    loading: false,
    error: null,
  };
};

const initialState = getStoredAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", accessToken);
        if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
      }
    },
    logoutSuccess: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
        localStorage.removeItem("aura_token");
      }
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    restoreAuthSession: (state, action) => {
      const { accessToken, refreshToken, user } = action.payload;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuthenticated = Boolean(accessToken);
      state.loading = false;
      state.error = null;
    },
  },
});

export const { loginSuccess, logoutSuccess, setAuthError, setAuthLoading, restoreAuthSession } = authSlice.actions;
export default authSlice.reducer;
