import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import Constants from "expo-constants";

// Auto-detect Host IP from Expo when running via Expo Go on physical phone / emulator
const getExpoHostIp = () => {
  try {
    const hostUri =
      Constants.expoConfig?.hostUri ||
      Constants.manifest2?.extra?.expoGo?.debuggerHost;
    if (hostUri) {
      return hostUri.split(":")[0];
    }
  } catch (e) {
    // Ignore error
  }
  return null;
};

const detectedHostIp = getExpoHostIp();

// Default API URL:
// 1. EXPO_PUBLIC_API_URL from .env
// 2. Auto-detected LAN IP if running on Expo Go (physical device / emulator)
// 3. Platform fallback (Android emulator 10.0.2.2 or localhost)
export const DEFAULT_API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (detectedHostIp
    ? `http://${detectedHostIp}:5000/api/v1`
    : Platform.select({
        android: "http://10.0.2.2:5000/api/v1",
        ios: "http://localhost:5000/api/v1",
        default: "http://localhost:5000/api/v1",
      }));

let currentBaseUrl = DEFAULT_API_URL;

export const setCustomBaseUrl = async (url) => {
  if (url) {
    let cleanUrl = url.trim();
    if (!cleanUrl.endsWith("/api/v1")) {
      cleanUrl = cleanUrl.replace(/\/+$/, "") + "/api/v1";
    }
    currentBaseUrl = cleanUrl;
    await AsyncStorage.setItem("custom_api_url", cleanUrl);
    api.defaults.baseURL = cleanUrl;
  }
};

export const getBaseUrl = () => currentBaseUrl;

const api = axios.create({
  baseURL: currentBaseUrl,
  timeout: 12000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Load saved custom base url
AsyncStorage.getItem("custom_api_url").then((savedUrl) => {
  if (savedUrl) {
    currentBaseUrl = savedUrl;
    api.defaults.baseURL = savedUrl;
  }
});

// Request Interceptor: Attach Auth Bearer Token
api.interceptors.request.use(
  async (config) => {
    try {
      const token =
        (await AsyncStorage.getItem("aura_token")) ||
        (await AsyncStorage.getItem("accessToken"));

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn("Failed to get token from storage", e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Normalize Errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const errorMsg =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Unable to connect to AURA OS Server";

    return Promise.reject(new Error(errorMsg));
  }
);

export default api;
