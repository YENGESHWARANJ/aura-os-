require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/database/mongodb");
const { initSocketServer } = require("./websocket/socketServer");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    await connectDB();

    const server = http.createServer(app);
    initSocketServer(server);

    server.listen(PORT, () => {
        console.log(`🚀 Server Running on Port ${PORT}`);
    });
};

startServer();
// Server initialized
