import { useEffect, useState } from 'react'
import { getPosts } from '../services/api.js'
import PostCard from '../components/PostCard.jsx'

export default function BrowsePets({ currentUser, typeFilter }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  async function refresh() {
    const data = await getPosts()
    setPosts(typeFilter ? data.filter((p) => p.type === typeFilter) : data)
    setLoading(false)
  }

  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typeFilter])

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <h1 className="font-display text-2xl font-semibold text-pine">
        {typeFilter === 'temporary' ? 'Temporary care' : 'Browse pets'}
      </h1>
      <p className="mt-1 mb-6 text-sm text-bark/70">
        {typeFilter === 'temporary'
          ? 'Pets whose owners need a caretaker for a while.'
          : 'Every pet up for adoption or temporary care on Furnest.'}
      </p>

      {loading ? (
        <p className="text-bark/60">Loading posts…</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-bark/50">Nothing here yet.</p>
      ) : (
        <div className="flex flex-col gap-5">
          {posts.map((post) => (
            <PostCard key={post.post_id} post={post} currentUser={currentUser} onChanged={refresh} />
          ))}
        </div>
      )}
    </div>
  )
}
