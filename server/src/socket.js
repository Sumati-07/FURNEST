//old code
/*const jwt = require("jsonwebtoken");
const Chat = require("./models/Chat");

function setupSocket(io) {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Authentication required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.userId = decoded.userId;

            next();
        } catch (error) {
            next(
                new Error("Invalid or expired token")
            );
        }
    });

    io.on("connection", (socket) => {
        console.log(
            `Socket connected: ${socket.userId}`
        );

        /*
         * PERSONAL USER ROOM
         *
         * Every logged-in user gets their own room.
         * Example:
         * user:68abc123...
         *
         * This allows FURNEST to send notifications
         * to the user even when they are NOT inside
         * the Chat page.
         */
        // socket.join(`user:${socket.userId}`);

        /*
         * JOIN CHAT ROOM
         *
         * This is the existing real-time chat system.
         * Keep this because your actual chat is already working.
         */
       /* socket.on("join_chat", async (chatId) => {
            try {
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: socket.userId
                });

                if (!chat) {
                    return;
                }

                socket.join(`chat:${chatId}`);

                console.log(
                    `User ${socket.userId} joined chat ${chatId}`
                );
            } catch (error) {
                console.error(
                    "join_chat error:",
                    error.message
                );
            }
        });

        /*
         * LEAVE CHAT ROOM
         */
       /* socket.on("leave_chat", (chatId) => {
            socket.leave(`chat:${chatId}`);

            console.log(
                `User ${socket.userId} left chat ${chatId}`
            );
        });

        /*
         * DISCONNECT
         */
       /* socket.on("disconnect", () => {
            console.log(
                `Socket disconnected: ${socket.userId}`
            );
        });
    });
}

module.exports = setupSocket;*/

//new code:
const jwt = require("jsonwebtoken");
const Chat = require("./models/Chat");

function setupSocket(io) {
    io.use((socket, next) => {
        try {
            const token = socket.handshake.auth?.token;

            if (!token) {
                return next(
                    new Error("Authentication required")
                );
            }

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            socket.userId = decoded.userId;

            next();
        } catch (error) {
            next(
                new Error("Invalid or expired token")
            );
        }
    });

    io.on("connection", (socket) => {
        console.log(
            `Socket connected: ${socket.userId}`
        );

        // Personal room for this user.
        // Used for notifications such as new chat messages.
        socket.join(`user:${socket.userId}`);

        socket.on("join_chat", async (chatId) => {
            try {
                const chat = await Chat.findOne({
                    _id: chatId,
                    participants: socket.userId
                });

                if (!chat) {
                    return;
                }

                socket.join(`chat:${chatId}`);

                console.log(
                    `User ${socket.userId} joined chat ${chatId}`
                );
            } catch (error) {
                console.error(
                    "join_chat error:",
                    error.message
                );
            }
        });

        socket.on("leave_chat", (chatId) => {
            socket.leave(`chat:${chatId}`);

            console.log(
                `User ${socket.userId} left chat ${chatId}`
            );
        });

        socket.on("disconnect", () => {
            console.log(
                `Socket disconnected: ${socket.userId}`
            );
        });
    });
}

module.exports = setupSocket;