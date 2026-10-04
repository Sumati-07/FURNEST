import { useState } from 'react'
import {
  Star,
  Send,
  UserRound,
  CalendarDays,
  MessageSquare,
} from 'lucide-react'

export default function Reviews() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const reviews = [
    {
      id: 1,
      name: 'Ananya Sharma',
      initials: 'AS',
      rating: 5,
      date: '12 Sep 2026',
      booking: 'Buddy · Golden Retriever',
      text:
        'Wonderful experience. The pet was friendly and well cared for throughout the booking. Communication was also very easy.',
    },
    {
      id: 2,
      name: 'Rahul Verma',
      initials: 'RV',
      rating: 4,
      date: '05 Sep 2026',
      booking: 'Milo · Persian Cat',
      text:
        'Everything went smoothly. The care instructions were clear and the overall experience was good.',
    },
    {
      id: 3,
      name: 'Priya Singh',
      initials: 'PS',
      rating: 5,
      date: '28 Aug 2026',
      booking: 'Coco · Beagle',
      text:
        'Great experience from start to finish. Very responsive and responsible during the care period.',
    },
  ]

  const ratingBreakdown = [
    { stars: 5, count: 18, percentage: 75 },
    { stars: 4, count: 5, percentage: 21 },
    { stars: 3, count: 1, percentage: 4 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 },
  ]

  function handleSubmit(e) {
    e.preventDefault()

    if (!rating || !reviewText.trim()) {
      return
    }

    setSubmitted(true)
    setReviewText('')
    setRating(0)
    setHoverRating(0)
  }

  function renderStars(value, size = 16) {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= value
                ? 'fill-honey text-honey'
                : 'text-sand'
            }
          />
        ))}
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl bg-pine px-6 py-8 shadow-lg sm:px-8">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Star size={24} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                FURNEST
              </p>

              <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Reviews & Ratings
              </h1>
            </div>
          </div>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
            Share your experience and help other FURNEST users
            build trust within the pet-care community.
          </p>
        </div>
      </div>

      {/* Rating summary */}
      <div className="mt-6 grid gap-5 lg:grid-cols-[280px_1fr]">
        <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-bark/50">
            Overall rating
          </p>

          <div className="mt-3 flex items-end gap-3">
            <span className="font-display text-5xl font-semibold text-pine">
              4.8
            </span>

            <div className="pb-2">
              {renderStars(5, 18)}

              <p className="mt-1 text-xs text-bark/50">
                Based on 24 reviews
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-meadow/50 p-4">
            <p className="text-xs text-bark/50">
              Community feedback
            </p>

            <p className="mt-1 text-sm font-medium text-bark">
              Excellent care experiences
            </p>
          </div>
        </div>

        {/* Rating breakdown */}
        <div className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
          <h2 className="font-display text-lg font-semibold text-bark">
            Rating breakdown
          </h2>

          <div className="mt-5 space-y-3">
            {ratingBreakdown.map((item) => (
              <div
                key={item.stars}
                className="flex items-center gap-3"
              >
                <div className="flex w-12 items-center gap-1 text-xs text-bark/60">
                  {item.stars}
                  <Star
                    size={13}
                    className="fill-honey text-honey"
                  />
                </div>

                <div className="h-2 flex-1 overflow-hidden rounded-full bg-sand">
                  <div
                    className="h-full rounded-full bg-honey"
                    style={{
                      width: `${item.percentage}%`,
                    }}
                  />
                </div>

                <span className="w-8 text-right text-xs text-bark/50">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Write review */}
      <section className="mt-6 rounded-3xl border border-sand bg-white p-6 shadow-sm sm:p-7">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey/20 text-bark">
            <MessageSquare size={20} />
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-bark">
              Write a review
            </h2>

            <p className="text-xs text-bark/50">
              Tell the community about your experience
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-pine/20 bg-pine/5 p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-pine text-white">
                <Star size={18} />
              </div>

              <div>
                <p className="font-medium text-pine">
                  Review submitted successfully!
                </p>

                <p className="mt-1 text-xs text-bark/50">
                  Thank you for sharing your experience.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSubmitted(false)}
              className="mt-4 text-sm font-medium text-pine hover:underline"
            >
              Write another review
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mt-6"
          >
            {/* Star selection */}
            <div>
              <p className="text-sm font-medium text-bark">
                Your rating
              </p>

              <div className="mt-3 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() =>
                      setHoverRating(star)
                    }
                    onMouseLeave={() =>
                      setHoverRating(0)
                    }
                    onClick={() => setRating(star)}
                    className="rounded-lg p-1 transition hover:scale-110"
                    aria-label={`${star} star`}
                  >
                    <Star
                      size={28}
                      className={
                        star <=
                        (hoverRating || rating)
                          ? 'fill-honey text-honey'
                          : 'text-sand'
                      }
                    />
                  </button>
                ))}

                {rating > 0 && (
                  <span className="ml-2 text-sm text-bark/50">
                    {rating === 1
                      ? 'Poor'
                      : rating === 2
                        ? 'Fair'
                        : rating === 3
                          ? 'Good'
                          : rating === 4
                            ? 'Very good'
                            : 'Excellent'}
                  </span>
                )}
              </div>
            </div>

            {/* Review text */}
            <div className="mt-5">
              <label
                htmlFor="review"
                className="text-sm font-medium text-bark"
              >
                Your review
              </label>

              <textarea
                id="review"
                value={reviewText}
                onChange={(e) =>
                  setReviewText(e.target.value)
                }
                placeholder="Tell us about your experience..."
                rows={5}
                className="focus-ring mt-2 w-full resize-none rounded-2xl border border-sand bg-white px-4 py-3 text-sm text-bark outline-none placeholder:text-bark/30"
              />
            </div>

            {/* Submit */}
            <div className="mt-4 flex justify-end">
              <button
                type="submit"
                disabled={!rating || !reviewText.trim()}
                className="inline-flex items-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pineDark disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send size={16} />
                Submit review
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Previous reviews */}
      <section className="mt-8">
        <div className="mb-4">
          <h2 className="font-display text-xl font-semibold text-bark">
            Recent reviews
          </h2>

          <p className="mt-1 text-sm text-bark/50">
            What other FURNEST users are saying
          </p>
        </div>

        <div className="grid gap-4">
          {reviews.map((review) => (
            <article
              key={review.id}
              className="rounded-3xl border border-sand bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                {/* Avatar */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-pine/10 text-sm font-semibold text-pine">
                  {review.initials}
                </div>

                {/* Review content */}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-bark">
                        {review.name}
                      </h3>

                      <div className="mt-1 flex items-center gap-2">
                        {renderStars(review.rating, 14)}

                        <span className="text-xs text-bark/40">
                          {review.date}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 flex items-center gap-2 text-xs text-bark/50">
                    <CalendarDays size={13} />

                    {review.booking}
                  </div>

                  <p className="mt-3 text-sm leading-6 text-bark/70">
                    {review.text}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Demo notice */}
      <div className="mt-6 rounded-2xl border border-dashed border-sand bg-white/60 p-4 text-center">
        <p className="text-xs leading-5 text-bark/50">
          These reviews are sample frontend data. Real reviews
          will be connected to the backend later.
        </p>
      </div>
    </div>
  )
}