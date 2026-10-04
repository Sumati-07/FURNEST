import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Search, Bell, MessageCircle, ChevronDown } from 'lucide-react'
import { getNotifications, markNotificationRead } from '../services/api.js'

export default function TopBar({ onToggleSidebar, currentUser }) {
  const [notifications, setNotifications] = useState([])
  const [open, setOpen] = useState(false)
  const panelRef = useRef(null)

  useEffect(() => {
    if (currentUser) getNotifications().then(setNotifications).catch(() => {})
  }, [currentUser])

  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.isRead).length

  async function handleOpen() {
    setOpen((prev) => !prev)
    if (!open) {
      await Promise.all(notifications.filter((n) => !n.isRead).map((n) => markNotificationRead(n._id)))
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
    }
  }

  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b border-sand bg-white px-4 py-3 sm:px-6">
      <button type="button" onClick={onToggleSidebar} className="rounded-lg p-2 hover:bg-meadow sm:hidden">
        <Menu size={20} />
      </button>

      <div className="relative flex-1 max-w-md">
        <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-bark/40" />
        <input
          placeholder="Search pets, caretakers, services…"
          className="focus-ring w-full rounded-full border border-sand bg-meadow/50 py-2 pl-9 pr-3 text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-3">
        <div className="relative" ref={panelRef}>
          <button type="button" onClick={handleOpen} className="relative rounded-full p-2 hover:bg-meadow">
            <Bell size={19} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-honey text-[10px] font-medium text-bark">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-72 rounded-lg border border-sand bg-white p-2 shadow-sm">
              {notifications.length === 0 ? (
                <p className="px-2 py-3 text-sm text-bark/60">No notifications yet.</p>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="rounded-md px-2 py-2 text-sm hover:bg-meadow">
                    {n.content}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <Link to="/chats" className="rounded-full p-2 hover:bg-meadow">
          <MessageCircle size={19} />
        </Link>

        <Link to="/dashboard" className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-meadow">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pine/10 text-sm font-medium text-pine">
            {(currentUser?.name || currentUser?.username || '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-medium leading-tight text-bark">{currentUser?.name || currentUser?.username}</p>
            <p className="text-xs leading-tight text-bark/50">Pet lover</p>
          </div>
          <ChevronDown size={14} className="hidden text-bark/40 sm:block" />
        </Link>
      </div>
    </header>
  )
}
