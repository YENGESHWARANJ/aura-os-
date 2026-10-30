const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const eventBus = require("../events/eventBus");
const Notification = require("../models/Notification");

let io;

const SUPPORTED_EVENTS = [
  "attendance.updated",
  "performance.updated",
  "assignment.updated",
  "assignment.completed",
  "assignment.overdue",
  "risk.updated",
  "notification.created",
  "alert.created",
  "skill.verified",
  "certificate.verified",
  "mentor.message",
  "student.activity",
];

const initSocketServer = (server) => {
  io = new Server(server, {
    cors: {
      origin: [
        /https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/,
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:8081",
        "http://localhost:19006",
      ],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    const studentIdParam = socket.handshake.auth?.studentId;

    if (!token) {
      // In dev or demo mode, allow connecting with guest / demo access
      socket.user = {
        id: "65e000000000000000000001",
        role: "student",
        studentId: studentIdParam || "AURA2026AI001",
        email: "student@aura.edu",
        name: "Student Demo User",
      };
      return next();
    }

    // Support demo tokens matching backend/src/middleware/auth/authenticate.js
    if (token.startsWith("demo-") || token === "demo-jwt-token") {
      let role = "student";
      if (token.includes("mentor")) role = "mentor";
      else if (token.includes("faculty")) role = "faculty";
      else if (token.includes("parent")) role = "parent";
      else if (token.includes("admin") || token.includes("hod")) role = "admin";

      socket.user = {
        id: "65e000000000000000000001",
        role: role,
        studentId: studentIdParam || "AURA2026AI001",
        email: `${role}@aura.edu`,
        name: `${role.charAt(0).toUpperCase() + role.slice(1)} Demo User`,
      };
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "AURA_OS_SECRET");
      socket.user = {
        ...decoded,
        studentId: studentIdParam || decoded.studentId,
      };
      next();
    } catch (error) {
      // Graceful fallback for dev
      socket.user = {
        id: "65e000000000000000000001",
        role: "student",
        studentId: studentIdParam || "AURA2026AI001",
        email: "student@aura.edu",
        name: "Student Demo User",
      };
      next();
    }
  });

  io.on("connection", async (socket) => {
    const userId = socket.user?.id || socket.user?._id;
    const userRole = socket.user?.role || "student";
    const studentId = socket.user?.studentId;

    socket.join("aura:broadcast");

    if (userId) {
      socket.join(`user:${userId}`);
    }

    if (studentId) {
      socket.join(`student:${studentId}`);
    }

    if (userRole) {
      socket.join(`role:${userRole}`);
    }

    // Client dynamically subscribes to a specific student
    socket.on("student:subscribe", ({ studentId: subId }) => {
      if (subId) {
        socket.join(`student:${subId}`);
      }
    });

    socket.on("student:unsubscribe", ({ studentId: subId }) => {
      if (subId) {
        socket.leave(`student:${subId}`);
      }
    });

    // Send initial unread count on connect
    if (userId) {
      try {
        const count = await Notification.countDocuments({
          $or: [
            { recipient: userId },
            { receiverId: userId },
            ...(userRole ? [{ roles: userRole }] : []),
          ],
          isRead: false,
        });
        socket.emit("notification.unread_count", { count });
      } catch (err) {
        // ignore
      }
    }

    // Client event: mark notification read
    socket.on("notification:mark_read", async ({ notificationId }) => {
      if (!userId || !notificationId) return;
      try {
        await Notification.updateOne(
          {
            _id: notificationId,
            $or: [{ recipient: userId }, { receiverId: userId }],
          },
          { isRead: true, readAt: new Date() }
        );
        const count = await Notification.countDocuments({
          $or: [
            { recipient: userId },
            { receiverId: userId },
            ...(userRole ? [{ roles: userRole }] : []),
          ],
          isRead: false,
        });
        socket.emit("notification.unread_count", { count });
      } catch (err) {
        // ignore
      }
    });

    socket.on("disconnect", () => {});
  });

  // Register all 12 real-time events on eventBus
  SUPPORTED_EVENTS.forEach((eventName) => {
    eventBus.on(eventName, (payload = {}) => {
      if (!io) return;

      const targetStudentId = payload.studentId || payload.student;
      const targetUserId = payload.userId || payload.recipient || payload.receiverId;

      // 1. Emit to student-specific room
      if (targetStudentId) {
        io.to(`student:${targetStudentId}`).emit(eventName, payload);
      }

      // 2. Emit to user-specific room
      if (targetUserId) {
        io.to(`user:${targetUserId}`).emit(eventName, payload);
      }

      // 3. Emit to all connected clients (so active student dashboard views update instantly)
      io.emit(eventName, payload);
    });
  });

  // Dedicated handler for notification.created unread counter update
  eventBus.on("notification.created", async (notification) => {
    if (!io) return;
    const targetUserId = notification.recipient || notification.receiverId;
    if (targetUserId) {
      try {
        const count = await Notification.countDocuments({
          $or: [{ recipient: targetUserId }, { receiverId: targetUserId }],
          isRead: false,
        });
        io.to(`user:${targetUserId}`).emit("notification.unread_count", { count });
        io.emit("notification.unread_count", { count });
      } catch (err) {
        // ignore
      }
    }
  });
};

const emitSocketEvent = (eventName, payload) => {
  if (io) {
    eventBus.emit(eventName, payload);
  }
};

const getSocketServer = () => io;

module.exports = {
  initSocketServer,
  getSocketServer,
  emitSocketEvent,
  SUPPORTED_EVENTS,
};
