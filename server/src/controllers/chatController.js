const Chat = require("../models/Chat");
const Message = require("../models/Message");

// POST /api/chats
// { otherUserId, postId? }
async function getOrCreateChat(req, res) {
    const { otherUserId, postId } = req.body;

    let chat = await Chat.findOne({
        participants: {
            $all: [req.userId, otherUserId],
            $size: 2
        }
    });

    if (!chat) {
        chat = await Chat.create({
            participants: [
                req.userId,
                otherUserId
            ],
            post: postId
        });
    }

    res.status(200).json(chat);
}


// GET /api/chats
async function getMyChats(req, res) {
    const chats = await Chat.find({
        participants: req.userId
    })
        .populate(
            "participants",
            "name username avatar"
        )
        .sort({
            lastMessageAt: -1
        });

    const withLastMessage = await Promise.all(
        chats.map(async (chat) => {
            const lastMessage =
                await Message.findOne({
                    chat: chat._id
                }).sort({
                    createdAt: -1
                });

            const partner =
                chat.participants.find(
                    (p) =>
                        p._id.toString() !==
                        req.userId
                );

            return {
                chat_id: chat._id,
                partner,
                lastMessage
            };
        })
    );

    res.json(withLastMessage);
}


// GET /api/chats/:chatId/messages
async function getMessages(req, res) {
    const chat = await Chat.findOne({
        _id: req.params.chatId,
        participants: req.userId
    });

    if (!chat) {
        return res.status(403).json({
            message: "You are not a participant in this chat"
        });
    }

    const messages = await Message.find({
        chat: req.params.chatId
    }).sort({
        createdAt: 1
    });

    res.json(messages);
}


// POST /api/chats/:chatId/messages
// { content }
async function sendMessage(req, res) {
    const { content } = req.body;

    if (!content || !content.trim()) {
        return res.status(400).json({
            message: "Message content is required"
        });
    }

    const chat = await Chat.findOne({
        _id: req.params.chatId,
        participants: req.userId
    });

    if (!chat) {
        return res.status(403).json({
            message:
                "You are not a participant in this chat"
        });
    }

    /*
     * Create the message
     */
    const message = await Message.create({
        chat: req.params.chatId,
        sender: req.userId,
        content: content.trim()
    });

    /*
     * Update chat's latest message time
     */
    await Chat.findByIdAndUpdate(
        req.params.chatId,
        {
            lastMessageAt: new Date()
        }
    );

    const io = req.app.get("io");

    if (io) {

        /*
         * ------------------------------------------
         * 1. EXISTING REAL-TIME CHAT
         * ------------------------------------------
         *
         * This keeps your current working chat.
         */
        io.to(`chat:${req.params.chatId}`).emit(
            "new_message",
            message
        );


        /*
         * ------------------------------------------
         * 2. CHAT NOTIFICATION
         * ------------------------------------------
         *
         * Find the other participant(s) in the chat.
         */
        const recipientIds = chat.participants
            .map((participantId) =>
                participantId.toString()
            )
            .filter(
                (participantId) =>
                    participantId !==
                    req.userId.toString()
            );


        /*
         * ------------------------------------------
         * 3. SEND NOTIFICATION
         * ------------------------------------------
         *
         * Send the notification to each recipient's
         * personal Socket.IO room.
         *
         * The Sidebar listens for:
         *
         * "chat_notification"
         */
        recipientIds.forEach((recipientId) => {
            io.to(`user:${recipientId}`).emit(
                "chat_notification",
                {
                    chatId: req.params.chatId,
                    messageId: message._id,
                    senderId: req.userId,
                    content: message.content
                }
            );
        });
    }

    res.status(201).json(message);
}


module.exports = {
    getOrCreateChat,
    getMyChats,
    getMessages,
    sendMessage
};