import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageSquare, Send } from 'lucide-react'
import { toggleLike, addComment, applyToPost } from '../services/api.js'

export default function PostCard({ post, currentUser, onChanged }) {
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState('')
  const [applied, setApplied] = useState(false)

  const navigate = useNavigate()

  const currentId = currentUser?._id || currentUser?.id
  const isOwnPost = post.owner?._id === currentId
  const isAdoption = post.type === 'adoption'

  const ownerInitials = (
    post.owner?.name ||
    post.owner?.username ||
    '?'
  )
    .slice(0, 2)
    .toUpperCase()

  async function handleLike() {
    await toggleLike({ postId: post.post_id })
    onChanged()
  }

  async function handleComment(e) {
    e.preventDefault()

    if (!commentText.trim()) return

    await addComment({
      postId: post.post_id,
      content: commentText
    })

    setCommentText('')
    onChanged()
  }

  async function handleAccept() {
    await applyToPost({
      postId: post.post_id
    })

    setApplied(true)
  }

  function handleViewApplicants() {
    navigate(`/posts/${post.post_id}/applications`)
  }

  return (
    <article className="overflow-hidden rounded-card border border-sand bg-white">

      {/* ============================================================
          PET IMAGE
      ============================================================ */}

      <div className="relative h-40 w-full overflow-hidden bg-sand/40">
        <img
          src={post.pet?.photo}
          alt={post.pet?.name}
          className="h-full w-full object-cover"
        />

        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium shadow-sm ${
            isAdoption
              ? 'bg-honey text-bark'
              : 'bg-rosewood text-white'
          }`}
        >
          {isAdoption ? 'Adoption' : 'Temporary'}
        </span>
      </div>


      {/* ============================================================
          POST CONTENT
      ============================================================ */}

      <div className="p-5">

        {/* Owner information */}

        <div className="mb-3 flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pine/10 text-xs font-medium text-pine">
            {ownerInitials}
          </div>

          <div>
            <p className="text-sm font-medium text-bark">
              {post.owner?.name || post.owner?.username}
            </p>

            {!isAdoption && (
              <p className="text-xs text-bark/50">
                {post.start_date} → {post.end_date}
              </p>
            )}
          </div>

        </div>


        {/* Pet name */}

        <h3 className="font-display text-lg font-semibold text-bark">
          {post.pet?.name}
        </h3>


        {/* Species */}

        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <span className="rounded-full bg-pine/10 px-2.5 py-0.5 text-xs font-medium text-pine">
            {post.pet?.species}
          </span>
        </div>


        {/* Pet details */}

        <p className="mt-2 text-sm text-bark/70">
          {post.pet?.breed} · {post.pet?.age} yrs · {post.pet?.health_notes}
        </p>


        {/* Temporary-care price */}

        {!isAdoption && (
          <p className="mt-2 text-sm font-medium text-honey">
            ₹{post.price_per_day}/day
          </p>
        )}


        {/* ============================================================
            ACTIONS
        ============================================================ */}

        <div className="mt-4 flex items-center gap-5 border-t border-sand pt-3 text-sm text-bark/70">

          {/* Like */}

          <button
            type="button"
            onClick={handleLike}
            className="flex items-center gap-1.5 hover:text-rosewood"
          >
            <Heart
              size={16}
              className={
                post.likedByMe
                  ? 'fill-rosewood text-rosewood'
                  : ''
              }
            />

            {post.likeCount}
          </button>


          {/* Comments */}

          <button
            type="button"
            onClick={() => setShowComments((v) => !v)}
            className="flex items-center gap-1.5 hover:text-pine"
          >
            <MessageSquare size={16} />

            {post.comments.length}
          </button>


          {/* ==========================================================
              STEP 9 — OWNER VIEW APPLICANTS
          ========================================================== */}

          {isOwnPost && !isAdoption && (
            <button
              type="button"
              onClick={handleViewApplicants}
              className="rounded-full border border-pine px-4 py-1.5 text-xs font-medium text-pine hover:bg-pine/5"
            >
              View applicants
            </button>
          )}


          {/* Start chat */}

          <button
            type="button"
            onClick={() =>
              navigate('/chats', {
                state: {
                  otherUserId: post.owner?._id,
                  postId: post.post_id
                }
              })
            }
            className="ml-auto text-xs font-medium text-pine hover:underline"
          >
            Start a chat
          </button>


          {/* ==========================================================
              APPLY / ACCEPT JOB
          ========================================================== */}

          {!isOwnPost && (
            <button
              type="button"
              onClick={handleAccept}
              disabled={applied}
              className="rounded-full bg-pine px-4 py-1.5 text-xs font-medium text-white hover:bg-pineDark disabled:opacity-60"
            >
              {applied
                ? 'Applied'
                : isAdoption
                  ? 'Ask about adopting'
                  : 'Accept the job'}
            </button>
          )}

        </div>


        {/* ============================================================
            COMMENTS
        ============================================================ */}

        {showComments && (
          <div className="mt-3 space-y-2 border-t border-sand pt-3">

            {post.comments.map((c) => (
              <p
                key={c.comment_id}
                className="text-sm"
              >
                <span className="font-medium text-bark">
                  {c.user?.name}:
                </span>{' '}

                <span className="text-bark/80">
                  {c.content}
                </span>
              </p>
            ))}


            {/* Add comment */}

            <form
              onSubmit={handleComment}
              className="flex items-center gap-2 pt-1"
            >

              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Leave a comment…"
                className="focus-ring flex-1 rounded-full border border-sand bg-white px-3 py-1.5 text-sm"
              />

              <button
                type="submit"
                className="rounded-full p-2 text-pine hover:bg-meadow"
                aria-label="Send comment"
              >
                <Send size={16} />
              </button>

            </form>

          </div>
        )}

      </div>
    </article>
  )
}