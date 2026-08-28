import { io } from "socket.io-client";

// In dev: connect to Vite's own origin → /socket.io proxy forwards to :5000
// In prod: set VITE_API_URL to your backend URL
const apiHost = import.meta.env.VITE_API_URL || window.location.origin;

let socket;

export const initSocket = () => {
  if (socket) return socket;

  const token = localStorage.getItem("accessToken") || localStorage.getItem("aura_token");
  if (!token) return null;

  socket = io(apiHost, {
    auth: {
      token,
    },
    transports: ["websocket"],
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connect error:", error.message || error);
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
