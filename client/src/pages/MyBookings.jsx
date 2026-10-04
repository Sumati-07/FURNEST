import { useNavigate } from 'react-router-dom'
import {
  CalendarDays,
  Clock,
  MapPin,
  PawPrint,
  MessageCircle,
  ChevronRight,
  CheckCircle2,
  Timer,
  Star,
} from 'lucide-react'

export default function MyBookings() {
  const navigate = useNavigate()
  // ============================================================
  // SAMPLE DATA
  // Replace this with real API data later.
  // ============================================================

  const bookings = [
    {
      id: 'demo-1',
      petName: 'Buddy',
      petSpecies: 'Dog',
      petBreed: 'Golden Retriever',
      petEmoji: '🐕',
      caretakerName: 'Ananya Sharma',
      caretakerInitials: 'AS',
      startDate: '05 Oct 2026',
      endDate: '12 Oct 2026',
      pricePerDay: 550,
      totalAmount: 3850,
      status: 'Confirmed',
      statusType: 'confirmed',
      location: 'Lucknow',
    },
    {
      id: 'demo-2',
      petName: 'Milo',
      petSpecies: 'Cat',
      petBreed: 'Persian',
      petEmoji: '🐈',
      caretakerName: 'Rahul Verma',
      caretakerInitials: 'RV',
      startDate: '28 Sep 2026',
      endDate: '02 Oct 2026',
      pricePerDay: 450,
      totalAmount: 1800,
      status: 'In Progress',
      statusType: 'progress',
      location: 'Lucknow',
    },
    {
      id: 'demo-3',
      petName: 'Coco',
      petSpecies: 'Dog',
      petBreed: 'Beagle',
      petEmoji: '🐶',
      caretakerName: 'Priya Singh',
      caretakerInitials: 'PS',
      startDate: '15 Oct 2026',
      endDate: '20 Oct 2026',
      pricePerDay: 500,
      totalAmount: 2500,
      status: 'Upcoming',
      statusType: 'upcoming',
      location: 'Kanpur',
    },
    {
      id: 'demo-4',
      petName: 'Luna',
      petSpecies: 'Cat',
      petBreed: 'British Shorthair',
      petEmoji: '🐱',
      caretakerName: 'Neha Kapoor',
      caretakerInitials: 'NK',
      startDate: '10 Sep 2026',
      endDate: '15 Sep 2026',
      pricePerDay: 400,
      totalAmount: 2000,
      status: 'Completed',
      statusType: 'completed',
      location: 'Lucknow',
    },
  ]

  // ============================================================
  // STATUS HELPERS
  // ============================================================

  function getStatusStyle(statusType) {
    switch (statusType) {
      case 'confirmed':
        return {
          badge: 'bg-pine/10 text-pine',
          icon: <CheckCircle2 size={14} />,
        }

      case 'progress':
        return {
          badge: 'bg-honey/20 text-bark',
          icon: <Timer size={14} />,
        }

      case 'upcoming':
        return {
          badge: 'bg-blue-50 text-blue-700',
          icon: <CalendarDays size={14} />,
        }

      case 'completed':
        return {
          badge: 'bg-sand text-bark/70',
          icon: <CheckCircle2 size={14} />,
        }

      default:
        return {
          badge: 'bg-sand text-bark',
          icon: <Clock size={14} />,
        }
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="relative overflow-hidden rounded-3xl bg-pine px-6 py-8 shadow-lg sm:px-8">

        {/* Decorative circles */}

        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />

        <div className="absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-white/5" />

        <div className="relative">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <CalendarDays size={24} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                FURNEST
              </p>

              <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                My bookings
              </h1>
            </div>

          </div>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
            Keep track of your pet's temporary-care arrangements,
            upcoming stays, and completed bookings all in one place.
          </p>

        </div>
      </div>


      {/* ============================================================
          QUICK SUMMARY
      ============================================================ */}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">

        <div className="rounded-2xl border border-sand bg-white p-4 shadow-sm">
          <p className="text-xs text-bark/50">
            Total bookings
          </p>

          <p className="mt-1 font-display text-2xl font-semibold text-pine">
            4
          </p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-4 shadow-sm">
          <p className="text-xs text-bark/50">
            Upcoming
          </p>

          <p className="mt-1 font-display text-2xl font-semibold text-bark">
            2
          </p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-4 shadow-sm">
          <p className="text-xs text-bark/50">
            In progress
          </p>

          <p className="mt-1 font-display text-2xl font-semibold text-bark">
            1
          </p>
        </div>

        <div className="rounded-2xl border border-sand bg-white p-4 shadow-sm">
          <p className="text-xs text-bark/50">
            Completed
          </p>

          <p className="mt-1 font-display text-2xl font-semibold text-bark">
            1
          </p>
        </div>

      </div>


      {/* ============================================================
          BOOKING LIST
      ============================================================ */}

      <div className="mt-8">

        <div className="mb-4 flex items-center justify-between">

          <div>
            <h2 className="font-display text-xl font-semibold text-bark">
              Your bookings
            </h2>

            <p className="mt-1 text-sm text-bark/50">
              Your recent and upcoming pet-care arrangements
            </p>
          </div>

        </div>


        <div className="grid gap-5">

          {bookings.map((booking) => {

            const status = getStatusStyle(booking.statusType)

            return (
              <div
                key={booking.id}
                className="group overflow-hidden rounded-3xl border border-sand bg-white shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >

                {/* ==================================================
                    TOP SECTION
                ================================================== */}

                <div className="p-5 sm:p-6">

                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start">

                    {/* Pet avatar */}

                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-meadow text-4xl shadow-inner">
                      {booking.petEmoji}
                    </div>


                    {/* Pet information */}

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="font-display text-xl font-semibold text-bark">
                          {booking.petName}
                        </h3>

                        <span className="rounded-full bg-pine/10 px-2.5 py-1 text-xs font-medium text-pine">
                          {booking.petSpecies}
                        </span>

                      </div>

                      <p className="mt-1 text-sm text-bark/60">
                        {booking.petBreed}
                      </p>


                      {/* Caretaker */}

                      <div className="mt-4 flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-pine/10 text-xs font-semibold text-pine">
                          {booking.caretakerInitials}
                        </div>

                        <div>
                          <p className="text-xs text-bark/40">
                            Caretaker
                          </p>

                          <p className="text-sm font-medium text-bark">
                            {booking.caretakerName}
                          </p>
                        </div>

                      </div>

                    </div>


                    {/* Status */}

                    <div
                      className={`flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${status.badge}`}
                    >
                      {status.icon}
                      {booking.status}
                    </div>

                  </div>


                  {/* ==================================================
                      DETAILS
                  ================================================== */}

                  <div className="mt-6 grid gap-4 rounded-2xl bg-meadow/40 p-4 sm:grid-cols-3">

                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 text-pine">
                        <CalendarDays size={18} />
                      </div>

                      <div>
                        <p className="text-xs text-bark/40">
                          Care period
                        </p>

                        <p className="mt-1 text-sm font-medium text-bark">
                          {booking.startDate}
                        </p>

                        <p className="text-xs text-bark/50">
                          to {booking.endDate}
                        </p>
                      </div>

                    </div>


                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 text-pine">
                        <MapPin size={18} />
                      </div>

                      <div>
                        <p className="text-xs text-bark/40">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-medium text-bark">
                          {booking.location}
                        </p>
                      </div>

                    </div>


                    <div className="flex items-start gap-3">

                      <div className="mt-0.5 text-pine">
                        <PawPrint size={18} />
                      </div>

                      <div>
                        <p className="text-xs text-bark/40">
                          Care type
                        </p>

                        <p className="mt-1 text-sm font-medium text-bark">
                          Temporary care
                        </p>
                      </div>

                    </div>

                  </div>

                </div>


                {/* ==================================================
                    PRICE + ACTIONS
                ================================================== */}

                <div className="flex flex-col gap-4 border-t border-sand px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">

                  {/* Price */}

                  <div>

                    <p className="text-xs text-bark/40">
                      Agreed rate
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">

                      <span className="font-display text-lg font-semibold text-pine">
                        ₹{booking.totalAmount}
                      </span>

                      <span className="text-xs text-bark/50">
                        total · ₹{booking.pricePerDay}/day
                      </span>

                    </div>

                  </div>


                  {/* Actions */}

                  <div className="flex flex-wrap gap-2">

                    <button
                     type="button"
                     onClick={() => navigate(`/bookings/${booking.id}`)}
                     className="inline-flex items-center gap-2 rounded-full border border-sand px-4 py-2 text-sm font-medium text-bark transition hover:border-pine hover:text-pine"
>
                     View details
                      <ChevronRight size={15} />
                    </button>

                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full bg-pine px-4 py-2 text-sm font-medium text-white transition hover:bg-pineDark"
                    >
                      <MessageCircle size={15} />
                      Contact
                    </button>

                    {booking.statusType === 'completed' && (
                      <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full border border-honey bg-honey/10 px-4 py-2 text-sm font-medium text-bark transition hover:bg-honey/20"
                      >
                        <Star size={15} />
                        Review
                      </button>
                    )}

                  </div>

                </div>

              </div>
            )
          })}

        </div>

      </div>


      {/* ============================================================
          DEMO NOTICE
      ============================================================ */}

      <div className="mt-6 rounded-2xl border border-dashed border-sand bg-white/60 p-4 text-center">

        <p className="text-xs leading-5 text-bark/50">
          These are sample bookings for the user interface.
          Real booking data will be connected later.
        </p>

      </div>

    </div>
  )
}