import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, PawPrint, MessagesSquare, Home as HomeIcon } from 'lucide-react'
import { getPosts } from '../services/api.js'

const heroPhotos = [
  'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=500&h=500&fit=crop',
  'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=500&h=500&fit=crop'
]

const steps = [
  {
    icon: Search,
    title: 'Browse',
    body: 'Look through pets nearby, up for adoption or needing a caretaker for a few days.'
  },
  {
    icon: MessagesSquare,
    title: 'Connect',
    body: 'Message the owner directly, ask questions, and agree on the details before anything is confirmed.'
  },
  {
    icon: HomeIcon,
    title: 'Welcome them home',
    body: "Whether it's forever or just for the week, give a pet a safe place to be while you're both there for each other."
  }
]

export default function LandingPage() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    getPosts().then((data) => setPosts(data.slice(0, 6)))
  }, [])

  return (
    <div className="bg-meadow">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <span className="font-display text-2xl font-semibold text-pine">furnest</span>
        <div className="flex items-center gap-3">
          <Link to="/login" className="rounded-full px-4 py-2 text-sm font-medium text-bark hover:bg-white">
            Log in
          </Link>
          <Link to="/register" className="rounded-full bg-pine px-5 py-2 text-sm font-medium text-white hover:bg-pineDark">
            Sign up
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 py-10 sm:grid-cols-2 sm:py-16">
        <div>
          <h1 className="font-display text-4xl font-semibold leading-tight text-pine sm:text-5xl">
            Give a pet a home. Even if it's just for a week.
          </h1>
          <p className="mt-5 max-w-md text-bark/75">
            Furnest is where owners find loving adopters, and travelling pet parents find trusted caretakers —
            one profile, both roles, no separate accounts.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#browse" className="rounded-full bg-honey px-6 py-3 text-sm font-medium text-bark hover:brightness-95">
              Browse pets
            </a>
            <a href="#how-it-works" className="rounded-full border border-sand bg-white px-6 py-3 text-sm font-medium text-bark hover:bg-meadow">
              How it works
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {heroPhotos.map((src, i) => (
            <img
              key={src}
              src={src}
              alt=""
              className={`h-40 w-full rounded-2xl object-cover shadow-sm sm:h-48 ${i % 2 === 1 ? 'mt-6' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* Browse */}
      <section id="browse" className="mx-auto max-w-6xl px-6 py-14">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-semibold text-bark sm:text-3xl">Pets on Furnest right now</h2>
          <PawPrint className="hidden text-honey sm:block" size={28} />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => {
            const isAdoption = post.type === 'adoption'
            return (
              <div key={post.post_id} className="overflow-hidden rounded-card border border-sand bg-white">
                <div className="relative h-44 w-full overflow-hidden bg-sand/40">
                  <img src={post.pet?.photo} alt={post.pet?.name} className="h-full w-full object-cover" />
                  <span
                    className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
                      isAdoption ? 'bg-honey text-bark' : 'bg-rosewood text-white'
                    }`}
                  >
                    {isAdoption ? 'Adoption' : 'Temporary'}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-display text-lg font-semibold text-bark">{post.pet?.name}</p>
                  <p className="text-sm text-bark/60">{post.pet?.species} · {post.pet?.breed}</p>
                  <Link
                    to="/login"
                    className="mt-3 block rounded-full bg-pine py-2 text-center text-sm font-medium text-white hover:bg-pineDark"
                  >
                    {isAdoption ? 'Ask about adopting' : 'Offer to help'}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-6 py-14">
        <h2 className="mb-10 text-center font-display text-2xl font-semibold text-bark sm:text-3xl">
          How Furnest works
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {steps.map(({ icon: Icon, title, body }) => (
            <div key={title} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-pine text-white">
                <Icon size={24} />
              </div>
              <h3 className="font-display text-lg font-semibold text-bark">{title}</h3>
              <p className="mt-2 text-sm text-bark/70">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-sand px-6 py-8 text-center text-sm text-bark/50">
        © 2026 Furnest — built for pets between homes.
      </footer>
    </div>
  )
}
