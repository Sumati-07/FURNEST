import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  PawPrint,
  Heart,
  PlusCircle,
  Home,
  CalendarClock,
  MessageCircle,
  Star,
  Settings,
  LogOut
} from 'lucide-react'

import { connectSocket } from '../services/socket'

const groups = [
  {
    label: null,
    links: [
      {
        to: '/dashboard',
        label: 'Dashboard',
        icon: LayoutDashboard,
        end: true
      }
    ]
  },
  {
    label: 'Pets',
    links: [
      {
        to: '/browse',
        label: 'Browse pets',
        icon: PawPrint
      },
      {
        to: '/my-pets',
        label: 'My pets',
        icon: Heart
      },
      {
        to: '/add-pet',
        label: 'Add pet',
        icon: PlusCircle
      }
    ]
  },
  {
    label: 'Care & bookings',
    links: [
      {
        to: '/temporary-care',
        label: 'Temporary care',
        icon: Home
      },
      {
        to: '/bookings',
        label: 'My bookings',
        icon: CalendarClock
      }
    ]
  },
  {
    label: 'Community',
    links: [
      {
        to: '/chats',
        label: 'Chat',
        icon: MessageCircle
      },
      {
        to: '/reviews',
        label: 'Reviews',
        icon: Star
      }
    ]
  },
  {
    label: 'Account',
    links: [
      {
        to: '/settings',
        label: 'Settings',
        icon: Settings
      }
    ]
  }
]

export default function Sidebar({ open, onLogout }) {
  const [unreadChats, setUnreadChats] = useState(0)

  /*
   * Connect to Socket.IO and listen for
   * notifications for new chat messages.
   */
  useEffect(() => {
    const socket = connectSocket()

    if (!socket) return

    const handleChatNotification = () => {
      setUnreadChats((count) => count + 1)
    }

    socket.on(
      'chat_notification',
      handleChatNotification
    )

    return () => {
      socket.off(
        'chat_notification',
        handleChatNotification
      )
    }
  }, [])

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 flex w-64 flex-col justify-between overflow-y-auto border-r border-sand bg-white transition-transform duration-200 ${
        open
          ? 'translate-x-0'
          : '-translate-x-full'
      } sm:translate-x-0 sm:static sm:z-0`}
    >
      <div>
        {/* LOGO */}
        <div className="px-5 pb-2 pt-5">
          <span className="font-display text-xl font-semibold text-pine">
            furnest
          </span>

          <p className="text-[11px] text-bark/50">
            A home for every heart
          </p>
        </div>

        {/* NAVIGATION */}
        <nav className="flex flex-col gap-5 p-3">
          {groups.map((group, i) => (
            <div key={i}>
              {group.label && (
                <p className="mb-1 px-3 text-[11px] font-medium uppercase tracking-wide text-bark/40">
                  {group.label}
                </p>
              )}

              <div className="flex flex-col gap-1">
                {group.links.map(
                  ({ to, label, icon: Icon, end }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={end}
                      onClick={() => {
                        /*
                         * Opening Chat clears the
                         * unread badge.
                         */
                        if (to === '/chats') {
                          setUnreadChats(0)
                        }
                      }}
                      className={({ isActive }) =>
                        `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                          isActive
                            ? 'bg-pine text-white'
                            : 'text-bark/80 hover:bg-meadow'
                        }`
                      }
                    >
                      {/* ICON + UNREAD BADGE */}
                      <div className="relative">
                        <Icon size={18} />

                        {to === '/chats' &&
                          unreadChats > 0 && (
                            <span className="absolute -right-3 -top-3 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
                              {unreadChats > 99
                                ? '99+'
                                : unreadChats}
                            </span>
                          )}
                      </div>

                      {label}
                    </NavLink>
                  )
                )}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* LOGOUT */}
      <button
        type="button"
        onClick={onLogout}
        className="m-4 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-rosewood hover:bg-meadow"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  )
}