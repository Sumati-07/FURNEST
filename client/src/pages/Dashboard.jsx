import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PawPrint, CalendarClock, MessageSquare, Star, Heart } from 'lucide-react'
import { getPosts, getPopularCaretakers, getConversations } from '../services/api.js'

function StatCard({ icon: Icon, label, value, hint, tint }) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-sand bg-white p-4">
      <div className={`flex h-12 w-12 items-center justify-center rounded-full ${tint}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm text-bark/60">{label}</p>
        <p className="font-display text-2xl font-semibold text-bark">{value}</p>
        {hint && <p className="text-xs text-pine">{hint}</p>}
      </div>
    </div>
  )
}

export default function Dashboard({ currentUser }) {
  const [posts, setPosts] = useState([])
  const [caretakers, setCaretakers] = useState([])
  const [conversationCount, setConversationCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([getPosts(), getPopularCaretakers().catch(() => []), getConversations().catch(() => [])]).then(
      ([postData, caretakerData, conversations]) => {
        setPosts(postData)
        setCaretakers(caretakerData)
        setConversationCount(conversations.length)
        setLoading(false)
      }
    )
  }, [])

  const openCount = posts.filter((p) => p.status !== 'closed').length

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-bark">
        Welcome back, {currentUser?.name || currentUser?.username} 👋
      </h1>
      <p className="mt-1 text-sm text-bark/60">Here's what's happening on Furnest today.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon={PawPrint} label="Pets available" value={openCount} tint="bg-rosewood/10 text-rosewood" />
        <StatCard icon={CalendarClock} label="Active bookings" value="—" hint="Coming soon" tint="bg-pine/10 text-pine" />
        <StatCard icon={MessageSquare} label="Conversations" value={conversationCount} tint="bg-honey/15 text-honey" />
        <StatCard icon={Star} label="Reviews" value="—" hint="Coming soon" tint="bg-sand text-bark/60" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold text-bark">Pets looking for a home</h2>
            <Link to="/browse" className="text-sm font-medium text-pine hover:underline">View all</Link>
          </div>

          {loading ? (
            <p className="text-sm text-bark/50">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {posts.slice(0, 6).map((post) => (
                <Link
                  key={post.post_id}
                  to="/browse"
                  className="overflow-hidden rounded-card border border-sand bg-white transition-shadow hover:shadow-sm"
                >
                  <div className="relative h-28 w-full">
                    <img src={post.pet?.photo} alt={post.pet?.name} className="h-full w-full object-cover" />
                    <Heart size={16} className="absolute right-2 top-2 text-white drop-shadow" />
                  </div>
                  <div className="p-2.5">
                    <p className="text-sm font-medium text-bark">{post.pet?.name}</p>
                    <p className="text-xs text-bark/50">{post.pet?.breed} · {post.pet?.age} yrs</p>
                  </div>
                </Link>
              ))}
            </div>
          )}

          <div className="mt-6">
            <h2 className="mb-3 font-display text-lg font-semibold text-bark">Popular caretakers</h2>
            {caretakers.length === 0 ? (
              <p className="text-sm text-bark/50">No rated caretakers yet — this fills in once bookings complete.</p>
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {caretakers.map((c) => (
                  <div key={c._id} className="flex items-center gap-3 rounded-card border border-sand bg-white p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pine/10 text-sm font-medium text-pine">
                      {(c.name || c.username).slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-bark">{c.name || c.username}</p>
                      <p className="text-xs text-honey">★ {c.caretakerStats?.averageRating?.toFixed(1) ?? '—'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="rounded-card border border-sand bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-bark">Upcoming bookings</h3>
              <Link to="/bookings" className="text-xs font-medium text-pine hover:underline">View all</Link>
            </div>
            <p className="text-sm text-bark/50">No bookings yet — this section fills in once bookings are built.</p>
          </div>

          <div className="rounded-card border border-sand bg-white p-4">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-display text-base font-semibold text-bark">Recent reviews</h3>
              <Link to="/reviews" className="text-xs font-medium text-pine hover:underline">View all</Link>
            </div>
            <p className="text-sm text-bark/50">No reviews yet — this section fills in once reviews are built.</p>
          </div>
        </aside>
      </div>

      <div className="mt-8 flex flex-col items-start gap-3 rounded-card bg-honey/15 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-bark">Ready to adopt?</h3>
          <p className="text-sm text-bark/70">Give a pet a loving home today.</p>
        </div>
        <Link to="/browse" className="rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-white hover:bg-pineDark">
          Browse pets
        </Link>
      </div>
    </div>
  )
}
