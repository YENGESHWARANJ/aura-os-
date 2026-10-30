import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DEFAULT_SOCKET_URL =
  process.env.EXPO_PUBLIC_SOCKET_URL || "http://10.0.2.2:5000";

let socket = null;

export async function connectMobileSocket() {
  const token =
    (await AsyncStorage.getItem("aura_token")) ||
    (await AsyncStorage.getItem("accessToken"));

  if (!token) return null;

  if (socket) {
    socket.auth = { token };
    if (!socket.connected) socket.connect();
    return socket;
  }

  socket = io(DEFAULT_SOCKET_URL, {
    auth: { token },
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    timeout: 10000,
  });

  socket.on("connect_error", (error) => {
    console.warn("[MobileSocket] Connection warning:", error.message || error);
  });

  return socket;
}

export async function subscribeToMobileNotifications(onNotification, onUnreadCount) {
  const activeSocket = await connectMobileSocket();
  if (!activeSocket) return () => {};

  const handleNotification = (notification) => {
    onNotification?.(notification);
  };
  const handleUnreadCount = (payload) => {
    onUnreadCount?.(payload?.count ?? 0);
  };

  activeSocket.on("notification.created", handleNotification);
  activeSocket.on("notification.received", handleNotification);
  activeSocket.on("notification.unread_count", handleUnreadCount);

  return () => {
    activeSocket.off("notification.created", handleNotification);
    activeSocket.off("notification.received", handleNotification);
    activeSocket.off("notification.unread_count", handleUnreadCount);
  };
}

export function disconnectMobileSocket() {
  if (!socket) return;
  socket.removeAllListeners();
  socket.disconnect();
  socket = null;
}
