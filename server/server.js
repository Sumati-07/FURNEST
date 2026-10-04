const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const connectDB = require("./src/config/db");

const authRoutes = require("./src/routes/authRoutes");
const petRoutes = require("./src/routes/petRoutes");
const postRoutes = require("./src/routes/postRoutes");
const notificationRoutes = require("./src/routes/notificationRoutes");
const analyticsRoutes = require("./src/routes/analyticsRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const userRoutes = require("./src/routes/userRoutes");
const bookingRoutes = require("./src/routes/bookingRoutes");

const setupSocket = require("./src/socket");

const app = express();

/*
 * ============================================================
 * MIDDLEWARE
 * ============================================================
 */

app.use(
    cors({
        origin: "http://localhost:5173"
    })
);

app.use(express.json());

connectDB();

/*
 * ============================================================
 * HOME
 * ============================================================
 */

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to FURNEST API"
    });
});

/*
 * ============================================================
 * API ROUTES
 * ============================================================
 */

app.use("/api/auth", authRoutes);

app.use("/api/pets", petRoutes);

app.use("/api/posts", postRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/chats", chatRoutes);

app.use("/api/users", userRoutes);

app.use("/api/bookings", bookingRoutes);

/*
 * ============================================================
 * HTTP SERVER
 * ============================================================
 */

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

/*
 * ============================================================
 * SOCKET.IO
 * ============================================================
 */

const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

setupSocket(io);

/*
 * Make Socket.IO available to controllers through:
 *
 * req.app.get("io")
 */
app.set("io", io);

/*
 * ============================================================
 * START SERVER
 * ============================================================
 */

httpServer.listen(PORT, () => {
    console.log(
        `FURNEST server running on port ${PORT}`
    );

    console.log(
        `Socket.IO running on port ${PORT}`
    );
});