import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock,
  MapPin,
  MessageCircle,
  PawPrint,
  Phone,
  Star,
  UserRound,
} from 'lucide-react'

export default function BookingDetails() {
  const { bookingId } = useParams()
  const navigate = useNavigate()

  const [completed, setCompleted] = useState(false)

  const bookings = {
    'demo-1': {
      id: 'demo-1',
      petName: 'Buddy',
      petSpecies: 'Dog',
      petBreed: 'Golden Retriever',
      petAge: '3 years',
      petEmoji: '🐕',
      caretakerName: 'Ananya Sharma',
      caretakerInitials: 'AS',
      caretakerRating: '4.8',
      caretakerBookings: 24,
      startDate: '05 Oct 2026',
      endDate: '12 Oct 2026',
      pricePerDay: 550,
      totalAmount: 3850,
      status: 'Confirmed',
      statusType: 'confirmed',
      location: 'Lucknow',
      address: 'Gomti Nagar, Lucknow',
      notes:
        'Buddy needs regular walks twice a day and should be given his food according to the usual schedule.',
    },

    'demo-2': {
      id: 'demo-2',
      petName: 'Milo',
      petSpecies: 'Cat',
      petBreed: 'Persian',
      petAge: '2 years',
      petEmoji: '🐈',
      caretakerName: 'Rahul Verma',
      caretakerInitials: 'RV',
      caretakerRating: '4.7',
      caretakerBookings: 18,
      startDate: '28 Sep 2026',
      endDate: '02 Oct 2026',
      pricePerDay: 450,
      totalAmount: 1800,
      status: 'In Progress',
      statusType: 'progress',
      location: 'Lucknow',
      address: 'Indira Nagar, Lucknow',
      notes:
        'Milo prefers a quiet environment and should have fresh water available throughout the day.',
    },

    'demo-3': {
      id: 'demo-3',
      petName: 'Coco',
      petSpecies: 'Dog',
      petBreed: 'Beagle',
      petAge: '4 years',
      petEmoji: '🐶',
      caretakerName: 'Priya Singh',
      caretakerInitials: 'PS',
      caretakerRating: '4.9',
      caretakerBookings: 31,
      startDate: '15 Oct 2026',
      endDate: '20 Oct 2026',
      pricePerDay: 500,
      totalAmount: 2500,
      status: 'Upcoming',
      statusType: 'upcoming',
      location: 'Kanpur',
      address: 'Civil Lines, Kanpur',
      notes:
        'Coco is friendly and energetic. Please make sure she gets her daily walk and play time.',
    },

    'demo-4': {
      id: 'demo-4',
      petName: 'Luna',
      petSpecies: 'Cat',
      petBreed: 'British Shorthair',
      petAge: '3 years',
      petEmoji: '🐱',
      caretakerName: 'Neha Kapoor',
      caretakerInitials: 'NK',
      caretakerRating: '4.6',
      caretakerBookings: 15,
      startDate: '10 Sep 2026',
      endDate: '15 Sep 2026',
      pricePerDay: 400,
      totalAmount: 2000,
      status: 'Completed',
      statusType: 'completed',
      location: 'Lucknow',
      address: 'Aliganj, Lucknow',
      notes:
        'Luna completed her stay successfully. She enjoys calm surroundings and gentle interaction.',
    },
  }

  const booking = bookings[bookingId]

  const displayStatusType = completed
    ? 'completed'
    : booking?.statusType

  const displayStatus = completed
    ? 'Completed'
    : booking?.status

  if (!booking) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-sm font-medium text-pine hover:underline"
        >
          <ArrowLeft size={16} />
          Back to bookings
        </Link>

        <div className="mt-8 rounded-3xl border border-sand bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand text-bark/60">
            <CalendarDays size={28} />
          </div>

          <h1 className="mt-5 font-display text-2xl font-semibold text-bark">
            Booking not found
          </h1>

          <p className="mt-2 text-sm text-bark/60">
            The booking you are looking for does not exist.
          </p>

          <Link
            to="/bookings"
            className="mt-6 inline-flex rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-white hover:bg-pineDark"
          >
            Return to bookings
          </Link>
        </div>
      </div>
    )
  }

  function getStatusStyle() {
    switch (displayStatusType) {
      case 'confirmed':
        return 'bg-pine/10 text-pine'

      case 'progress':
        return 'bg-honey/20 text-bark'

      case 'upcoming':
        return 'bg-blue-50 text-blue-700'

      case 'completed':
        return 'bg-sand text-bark/70'

      default:
        return 'bg-sand text-bark'
    }
  }

  function handleContact() {
    navigate('/chats')
  }

  function handleComplete() {
    const confirmed = window.confirm(
      'Mark this booking as completed?'
    )

    if (!confirmed) return

    setCompleted(true)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back */}
      <Link
        to="/bookings"
        className="inline-flex items-center gap-2 text-sm font-medium text-pine hover:underline"
      >
        <ArrowLeft size={16} />
        Back to bookings
      </Link>

      {/* Header */}
      <div className="mt-5 overflow-hidden rounded-3xl bg-pine shadow-lg">
        <div className="relative px-6 py-8 sm:px-8">
          <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 right-24 h-52 w-52 rounded-full bg-white/5" />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-white text-5xl shadow-lg">
                {booking.petEmoji}
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                  FURNEST · Temporary Care
                </p>

                <h1 className="mt-1 font-display text-3xl font-semibold text-white">
                  {booking.petName}
                </h1>

                <p className="mt-1 text-sm text-white/70">
                  {booking.petBreed} · {booking.petAge}
                </p>
              </div>
            </div>

            <div
              className={`flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm font-medium ${
                completed
                  ? 'bg-sand text-bark/70'
                  : getStatusStyle()
              }`}
            >
              {displayStatusType === 'completed' ? (
                <CheckCircle2 size={16} />
              ) : displayStatusType === 'progress' ? (
                <Clock size={16} />
              ) : (
                <CalendarDays size={16} />
              )}

              {displayStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {/* Care period */}
          <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine/10 text-pine">
                <CalendarDays size={20} />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-bark">
                  Care period
                </h2>

                <p className="text-xs text-bark/50">
                  Scheduled temporary-care arrangement
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl bg-meadow/50 p-4">
                <p className="text-xs text-bark/40">
                  Start date
                </p>

                <p className="mt-1 font-display text-lg font-semibold text-bark">
                  {booking.startDate}
                </p>
              </div>

              <div className="rounded-2xl bg-meadow/50 p-4">
                <p className="text-xs text-bark/40">
                  End date
                </p>

                <p className="mt-1 font-display text-lg font-semibold text-bark">
                  {booking.endDate}
                </p>
              </div>
            </div>
          </section>

          {/* Pet information */}
          <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine/10 text-pine">
                <PawPrint size={20} />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-bark">
                  Pet information
                </h2>

                <p className="text-xs text-bark/50">
                  Information about the pet staying with the caretaker
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-xs text-bark/40">Name</p>

                <p className="mt-1 text-sm font-medium text-bark">
                  {booking.petName}
                </p>
              </div>

              <div>
                <p className="text-xs text-bark/40">Species</p>

                <p className="mt-1 text-sm font-medium text-bark">
                  {booking.petSpecies}
                </p>
              </div>

              <div>
                <p className="text-xs text-bark/40">Breed</p>

                <p className="mt-1 text-sm font-medium text-bark">
                  {booking.petBreed}
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-honey/10 p-4">
              <p className="text-xs font-medium text-bark/50">
                Care instructions
              </p>

              <p className="mt-1 text-sm leading-6 text-bark/80">
                {booking.notes}
              </p>
            </div>
          </section>

          {/* Location */}
          <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine/10 text-pine">
                <MapPin size={20} />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-bark">
                  Care location
                </h2>

                <p className="text-xs text-bark/50">
                  Where the temporary care will take place
                </p>
              </div>
            </div>

            <div className="mt-5 rounded-2xl bg-meadow/50 p-4">
              <p className="text-sm font-medium text-bark">
                {booking.location}
              </p>

              <p className="mt-1 text-sm text-bark/60">
                {booking.address}
              </p>
            </div>
          </section>

          {/* Payment */}
          <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine/10 text-pine">
                <span className="text-lg font-semibold">₹</span>
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-bark">
                  Payment summary
                </h2>

                <p className="text-xs text-bark/50">
                  Agreed temporary-care amount
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-bark/60">
                  Care rate
                </span>

                <span className="font-medium text-bark">
                  ₹{booking.pricePerDay}/day
                </span>
              </div>

              <div className="border-t border-sand pt-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-bark">
                    Total amount
                  </span>

                  <span className="font-display text-2xl font-semibold text-pine">
                    ₹{booking.totalAmount}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right sidebar */}
        <aside className="space-y-6">
          {/* Caretaker */}
          <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine/10 text-pine">
                <UserRound size={20} />
              </div>

              <div>
                <h2 className="font-display text-lg font-semibold text-bark">
                  Caretaker
                </h2>

                <p className="text-xs text-bark/50">
                  Selected caretaker
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-pine/10 font-semibold text-pine">
                {booking.caretakerInitials}
              </div>

              <div>
                <p className="font-display text-base font-semibold text-bark">
                  {booking.caretakerName}
                </p>

                <div className="mt-1 flex items-center gap-1 text-xs text-bark/60">
                  <Star
                    size={13}
                    className="fill-honey text-honey"
                  />

                  {booking.caretakerRating}

                  <span>·</span>

                  {booking.caretakerBookings} bookings
                </div>
              </div>
            </div>

            <div className="mt-5 grid gap-2">
              <button
                type="button"
                onClick={handleContact}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-pine px-4 py-2.5 text-sm font-medium text-white transition hover:bg-pineDark"
              >
                <MessageCircle size={16} />
                Contact caretaker
              </button>

              <button
                type="button"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-sand px-4 py-2.5 text-sm font-medium text-bark transition hover:border-pine hover:text-pine"
              >
                <Phone size={16} />
                Call caretaker
              </button>
            </div>
          </section>

          {/* Booking status */}
          <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-semibold text-bark">
              Booking status
            </h2>

            <div className="mt-5 space-y-4">
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pine text-white">
                  <CheckCircle2 size={15} />
                </div>

                <div>
                  <p className="text-sm font-medium text-bark">
                    Caretaker selected
                  </p>

                  <p className="text-xs text-bark/50">
                    Booking confirmed
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                    displayStatusType === 'completed'
                      ? 'bg-pine text-white'
                      : 'bg-sand text-bark/50'
                  }`}
                >
                  {displayStatusType === 'completed' ? (
                    <CheckCircle2 size={15} />
                  ) : (
                    <Clock size={15} />
                  )}
                </div>

                <div>
                  <p className="text-sm font-medium text-bark">
                    Care completed
                  </p>

                  <p className="text-xs text-bark/50">
                    {displayStatusType === 'completed'
                      ? 'Booking successfully completed'
                      : 'Pending completion'}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Actions */}
          {displayStatusType !== 'completed' && (
            <section className="rounded-3xl border border-sand bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-semibold text-bark">
                Booking actions
              </h2>

              <p className="mt-1 text-xs leading-5 text-bark/50">
                Complete the booking after the temporary-care period
                has finished.
              </p>

              <button
                type="button"
                onClick={handleComplete}
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-honey px-4 py-2.5 text-sm font-medium text-bark transition hover:bg-honey/80"
              >
                <CheckCircle2 size={16} />
                Mark as completed
              </button>
            </section>
          )}

          {/* Completed */}
          {displayStatusType === 'completed' && (
            <section className="rounded-3xl border border-pine/20 bg-pine/5 p-6">
              <div className="flex items-center gap-2 text-pine">
                <CheckCircle2 size={18} />

                <h2 className="font-display font-semibold">
                  Booking completed
                </h2>
              </div>

              <p className="mt-2 text-sm leading-5 text-bark/60">
                This care arrangement has been completed successfully.
                You can leave a review for the caretaker next.
              </p>

              <Link
                to="/reviews"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-pine px-4 py-2.5 text-sm font-medium text-white hover:bg-pineDark"
              >
                <Star size={15} />
                Leave a review
              </Link>
            </section>
          )}
        </aside>
      </div>

      {/* Demo notice */}
      <div className="mt-6 rounded-2xl border border-dashed border-sand bg-white/60 p-4 text-center">
        <p className="text-xs leading-5 text-bark/50">
          This booking detail is currently using sample frontend data.
          Real booking information will be connected later.
        </p>
      </div>
    </div>
  )
}