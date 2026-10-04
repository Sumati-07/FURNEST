import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

import {
  getConversations,
  getOrCreateChat,
  getMessages,
  sendMessage
} from '../services/api.js'

import {
  connectSocket,
  disconnectSocket
} from '../services/socket.js'

export default function Chats({ currentUser }) {
  const location = useLocation()

  const [conversations, setConversations] =
    useState([])

  const [activeChat, setActiveChat] =
    useState(null)

  const [messages, setMessages] =
    useState([])

  const [draft, setDraft] =
    useState('')

  /*
   * ==========================================================
   * CONNECT SOCKET
   * ==========================================================
   */

  useEffect(() => {
    const socket = connectSocket()

    if (!socket) {
      return
    }

    return () => {
      disconnectSocket()
    }
  }, [])

  /*
   * ==========================================================
   * LOAD CONVERSATIONS
   * ==========================================================
   */

  useEffect(() => {
    getConversations()
      .then(setConversations)
      .catch((error) => {
        console.error(
          'Failed to load conversations:',
          error
        )
      })
  }, [])

  /*
   * ==========================================================
   * CREATE / OPEN CHAT FROM POST
   * ==========================================================
   */

  useEffect(() => {
    const otherUserId =
      location.state?.otherUserId

    if (!otherUserId) {
      return
    }

    getOrCreateChat({
      otherUserId,
      postId: location.state?.postId
    })
      .then((chat) => {
        setActiveChat({
          chat_id: chat._id,
          partner: {
            _id: otherUserId
          }
        })
      })
      .catch((error) => {
        console.error(
          'Failed to create chat:',
          error
        )
      })
  }, [location.state])

  /*
   * ==========================================================
   * LOAD MESSAGES + JOIN SOCKET ROOM
   * ==========================================================
   */

  useEffect(() => {
    if (!activeChat) {
      return
    }

    const chatId = activeChat.chat_id

    /*
     * Load existing messages.
     */
    getMessages(chatId)
      .then(setMessages)
      .catch((error) => {
        console.error(
          'Failed to load messages:',
          error
        )
      })

    /*
     * Get the Socket.IO connection.
     */
    const socket = connectSocket()

    if (!socket) {
      return
    }

    /*
     * Join this conversation's room.
     */
    socket.emit(
      'join_chat',
      chatId
    )

    /*
     * Receive new messages in real time.
     */
    const handleNewMessage = (message) => {
      /*
       * Only add the message if it belongs
       * to the currently open conversation.
       */
      if (
        String(message.chat) !==
        String(chatId)
      ) {
        return
      }

      setMessages((prev) => {
        /*
         * Prevent duplicate messages.
         *
         * This can happen because the sender also
         * receives the Socket.IO event while the
         * REST request already added the message.
         */
        const alreadyExists =
          prev.some(
            (item) =>
              item._id === message._id
          )

        if (alreadyExists) {
          return prev
        }

        return [...prev, message]
      })

      /*
       * Update the conversation preview.
       */
      setConversations((prev) =>
        prev.map((conversation) => {
          if (
            String(conversation.chat_id) !==
            String(chatId)
          ) {
            return conversation
          }

          return {
            ...conversation,
            lastMessage: message
          }
        })
      )
    }

    socket.on(
      'new_message',
      handleNewMessage
    )

    /*
     * Leave the room and remove listener
     * when switching chats/unmounting.
     */
    return () => {
      socket.emit(
        'leave_chat',
        chatId
      )

      socket.off(
        'new_message',
        handleNewMessage
      )
    }
  }, [activeChat])

  /*
   * ==========================================================
   * SEND MESSAGE
   * ==========================================================
   */

  async function handleSend(e) {
    e.preventDefault()

    if (
      !activeChat ||
      !draft.trim()
    ) {
      return
    }

    try {
      /*
       * The server saves the message and broadcasts
       * it through Socket.IO.
       */
      const message =
        await sendMessage({
          chatId:
            activeChat.chat_id,
          content: draft
        })

      /*
       * Add it immediately for the sender.
       *
       * The Socket.IO event will also arrive,
       * but the listener prevents duplicates.
       */
      setMessages((prev) => {
        const alreadyExists =
          prev.some(
            (item) =>
              item._id === message._id
          )

        if (alreadyExists) {
          return prev
        }

        return [...prev, message]
      })

      setConversations((prev) =>
        prev.map((conversation) => {
          if (
            String(conversation.chat_id) !==
            String(activeChat.chat_id)
          ) {
            return conversation
          }

          return {
            ...conversation,
            lastMessage: message
          }
        })
      )

      setDraft('')
    } catch (error) {
      console.error(
        'Failed to send message:',
        error
      )
    }
  }

  /*
   * ==========================================================
   * CURRENT USER
   * ==========================================================
   */

  const currentId =
    currentUser?._id ||
    currentUser?.id

  /*
   * ==========================================================
   * UI
   * ==========================================================
   */

  return (
    <div className="mx-auto flex max-w-4xl gap-6 px-4 py-8 sm:px-6">

      {/* CONVERSATIONS */}
      <aside className="w-56 shrink-0">

        <h2 className="mb-3 font-display text-lg font-semibold text-pine">
          Chats
        </h2>

        <div className="flex flex-col gap-1">

          {conversations.map(
            ({
              chat_id,
              partner,
              lastMessage
            }) => (
              <button
                key={chat_id}
                type="button"
                onClick={() =>
                  setActiveChat({
                    chat_id,
                    partner
                  })
                }
                className={`rounded-lg px-3 py-2 text-left text-sm ${
                  activeChat?.chat_id ===
                  chat_id
                    ? 'bg-pine text-white'
                    : 'hover:bg-white'
                }`}
              >

                <p className="font-medium">
                  {partner?.name ||
                    partner?.username}
                </p>

                <p
                  className={`truncate text-xs ${
                    activeChat?.chat_id ===
                    chat_id
                      ? 'text-white/70'
                      : 'text-bark/50'
                  }`}
                >
                  {lastMessage?.content}
                </p>

              </button>
            )
          )}

          {conversations.length === 0 && (
            <p className="text-sm text-bark/50">
              No conversations yet.
            </p>
          )}

        </div>

      </aside>


      {/* ACTIVE CHAT */}
      <section className="flex-1">

        {!activeChat ? (

          <p className="text-bark/60">
            Pick a conversation, or start one
            from a post.
          </p>

        ) : (

          <div className="flex h-[60vh] flex-col rounded-card border border-sand bg-white">

            {/* MESSAGES */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">

              {messages.map((m) => {

                const senderId =
                  typeof m.sender === 'object'
                    ? m.sender?._id
                    : m.sender

                const isMine =
                  String(senderId) ===
                  String(currentId)

                return (
                  <div
                    key={m._id}
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      isMine
                        ? 'ml-auto bg-pine text-white'
                        : 'bg-meadow text-bark'
                    }`}
                  >
                    {m.content}
                  </div>
                )
              })}

              {messages.length === 0 && (
                <p className="text-sm text-bark/50">
                  Say hello to get started.
                </p>
              )}

            </div>


            {/* MESSAGE INPUT */}
            <form
              onSubmit={handleSend}
              className="flex gap-2 border-t border-sand p-3"
            >

              <input
                value={draft}
                onChange={(e) =>
                  setDraft(e.target.value)
                }
                placeholder="Type a message…"
                className="focus-ring flex-1 rounded-full border border-sand bg-white px-3 py-2 text-sm"
              />

              <button
                type="submit"
                className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-white"
              >
                Send
              </button>

            </form>

          </div>

        )}

      </section>

    </div>
  )
}