const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const eventBus = require("../events/eventBus");

let io;

const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.user.id;
    const userRole = socket.user.role;
    const userRoom = `user:${userId}`;
    socket.join(userRoom);

    if (userRole) {
      socket.join(`role:${userRole}`);
    }

    socket.on("disconnect", () => {});
  });

  eventBus.on("notification.created", (notification) => {
    if (!io) return;

    if (notification.recipient) {
      io.to(`user:${notification.recipient}`).emit("notification.created", notification);
    }

    if (notification.roles && notification.roles.length > 0) {
      notification.roles.forEach((role) => io.to(`role:${role}`).emit("notification.created", notification));
    }
  });
};

const getSocketServer = () => io;

module.exports = {
  initSocketServer,
  getSocketServer,
};
