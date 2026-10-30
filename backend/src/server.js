require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/database/mongodb");
const { initSocketServer } = require("./websocket/socketServer");
const { initializeNotificationQueueProcessor } = require("./services/notificationQueue");
const { startDemoSimulation } = require("./services/demoSimulator");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const server = http.createServer(app);
    initSocketServer(server);
    await initializeNotificationQueueProcessor().catch(() => {});

    server.listen(PORT, "0.0.0.0", () => {
        console.log(`🚀 Server Running on Port ${PORT}`);
        startDemoSimulation();
    });
};

startServer();
