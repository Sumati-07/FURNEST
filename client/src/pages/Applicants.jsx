import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Star, CheckCircle } from 'lucide-react'
import {
  getApplicationsForPost,
  getPosts,
  acceptApplication
} from '../services/api.js'

export default function Applicants() {
  const { postId } = useParams()

  const [applications, setApplications] = useState([])
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [accepting, setAccepting] = useState(null)
  const [error, setError] = useState('')

  async function load() {
    try {
      setLoading(true)

      const [apps, posts] = await Promise.all([
        getApplicationsForPost(postId),
        getPosts()
      ])

      const selectedPost = posts.find(
        (item) => item.post_id === postId
      )

      setApplications(apps)
      setPost(selectedPost)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [postId])

  async function handleAccept(applicationId) {
    const confirmed = window.confirm(
      'Choose this caretaker? All other pending applications will be rejected and a booking will be created.'
    )

    if (!confirmed) return

    try {
      setAccepting(applicationId)

      await acceptApplication({
        postId,
        applicationId
      })

      await load()
    } catch (err) {
      setError(err.message)
    } finally {
      setAccepting(null)
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8">
        <p className="text-sm text-bark/60">
          Loading applicants…
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">

      <Link
        to="/temporary-care"
        className="mb-6 inline-flex items-center gap-2 text-sm text-pine hover:underline"
      >
        <ArrowLeft size={16} />
        Back to temporary care
      </Link>

      <h1 className="font-display text-2xl font-semibold text-pine">
        Caretaker applicants
      </h1>

      {post?.pet && (
        <p className="mt-1 text-sm text-bark/60">
          Applicants for {post.pet.name}
          {post.start_date && ` · ${post.start_date} → ${post.end_date}`}
        </p>
      )}

      {error && (
        <div className="mt-4 rounded-lg bg-rosewood/10 p-3 text-sm text-rosewood">
          {error}
        </div>
      )}

      {applications.length === 0 ? (
        <div className="mt-8 rounded-card border border-sand bg-white p-6">
          <p className="text-sm text-bark/60">
            Nobody has applied yet.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex flex-col gap-4">

          {applications.map((application) => {
            const caretaker = application.caretaker
            const score = Math.round(
              (application.matchScore || 0) * 100
            )

            return (
              <div
                key={application._id}
                className="rounded-card border border-sand bg-white p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-pine/10 font-medium text-pine">
                    {(caretaker?.name ||
                      caretaker?.username ||
                      '?')
                      .slice(0, 2)
                      .toUpperCase()}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-display text-lg font-semibold text-bark">
                      {caretaker?.name ||
                        caretaker?.username}
                    </h2>

                    <p className="text-sm text-bark/60">
                      @{caretaker?.username}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-bark/60">

                      <span>
                        <Star
                          size={13}
                          className="mr-1 inline text-honey"
                        />
                        {caretaker?.caretakerStats?.averageRating?.toFixed(1) ||
                          'New'}
                      </span>

                      <span>
                        {caretaker?.caretakerStats?.completedBookings || 0}{' '}
                        completed bookings
                      </span>

                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-xs text-bark/50">
                      Match
                    </p>

                    <p className="font-display text-2xl font-semibold text-pine">
                      {score}%
                    </p>
                  </div>

                  {application.status === 'pending' && (
                    <button
                      type="button"
                      onClick={() =>
                        handleAccept(application._id)
                      }
                      disabled={accepting === application._id}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-white hover:bg-pineDark disabled:opacity-60"
                    >
                      <CheckCircle size={16} />
                      {accepting === application._id
                        ? 'Creating booking…'
                        : 'Choose caretaker'}
                    </button>
                  )}

                  {application.status === 'accepted' && (
                    <span className="rounded-full bg-pine/10 px-4 py-2 text-sm font-medium text-pine">
                      Selected
                    </span>
                  )}

                  {application.status === 'rejected' && (
                    <span className="rounded-full bg-sand px-4 py-2 text-sm text-bark/60">
                      Not selected
                    </span>
                  )}

                </div>
              </div>
            )
          })}

        </div>
      )}
    </div>
  )
}