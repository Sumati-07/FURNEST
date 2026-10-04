import { useState } from 'react'
import {
  UserRound,
  Mail,
  Phone,
  Lock,
  Camera,
  Save,
  CheckCircle2,
  ShieldCheck,
} from 'lucide-react'

export default function Settings() {
  const [name, setName] = useState('Sumati')
  const [email, setEmail] = useState('sumati@example.com')
  const [phone, setPhone] = useState('+91 98765 43210')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [saved, setSaved] = useState(false)
  const [passwordMessage, setPasswordMessage] = useState('')

  function handleSaveProfile(e) {
    e.preventDefault()

    setSaved(true)

    setTimeout(() => {
      setSaved(false)
    }, 3000)
  }

  function handleChangePassword(e) {
    e.preventDefault()

    setPasswordMessage('')

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      setPasswordMessage(
        'Please fill in all password fields.'
      )
      return
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage(
        'New passwords do not match.'
      )
      return
    }

    if (newPassword.length < 6) {
      setPasswordMessage(
        'New password must contain at least 6 characters.'
      )
      return
    }

    setPasswordMessage(
      'Password changed successfully!'
    )

    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">

      {/* PAGE HEADER */}
      <div className="relative overflow-hidden rounded-3xl bg-pine px-6 py-8 shadow-lg sm:px-8">
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10" />

        <div className="absolute -bottom-20 right-20 h-44 w-44 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <UserRound size={24} />
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-widest text-white/60">
                FURNEST
              </p>

              <h1 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Account Settings
              </h1>
            </div>

          </div>

          <p className="mt-4 max-w-xl text-sm leading-6 text-white/75">
            Manage your profile information, contact details,
            and account security.
          </p>
        </div>
      </div>


      {/* PROFILE INFORMATION */}
      <section className="mt-6 rounded-3xl border border-sand bg-white p-6 shadow-sm sm:p-7">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pine/10 text-pine">
            <UserRound size={20} />
          </div>

          <div>
            <h2 className="font-display text-lg font-semibold text-bark">
              Profile information
            </h2>

            <p className="text-xs text-bark/50">
              Update your basic account information
            </p>
          </div>

        </div>


        {/* PROFILE PHOTO */}
        <div className="mt-6 flex flex-col items-center gap-4 sm:flex-row">

          <div className="relative">

            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-pine/10 text-2xl font-semibold text-pine">
              SU
            </div>

            <button
              type="button"
              className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-pine text-white shadow-md transition hover:bg-pineDark"
              aria-label="Change profile photo"
            >
              <Camera size={15} />
            </button>

          </div>

          <div>

            <p className="font-medium text-bark">
              Profile photo
            </p>

            <p className="mt-1 max-w-md text-xs leading-5 text-bark/50">
              Choose a photo that helps other FURNEST users
              recognize you.
            </p>

            <button
              type="button"
              className="mt-2 text-sm font-medium text-pine hover:underline"
            >
              Change photo
            </button>

          </div>

        </div>


        {/* PROFILE FORM */}
        <form
          onSubmit={handleSaveProfile}
          className="mt-7"
        >

          <div className="grid gap-5 sm:grid-cols-2">

            {/* NAME */}
            <div>

              <label
                htmlFor="name"
                className="text-sm font-medium text-bark"
              >
                Full name
              </label>

              <div className="relative mt-2">

                <UserRound
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/30"
                />

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="focus-ring w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-bark outline-none"
                />

              </div>

            </div>


            {/* EMAIL */}
            <div>

              <label
                htmlFor="email"
                className="text-sm font-medium text-bark"
              >
                Email address
              </label>

              <div className="relative mt-2">

                <Mail
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/30"
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="focus-ring w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-bark outline-none"
                />

              </div>

            </div>


            {/* PHONE */}
            <div className="sm:col-span-2">

              <label
                htmlFor="phone"
                className="text-sm font-medium text-bark"
              >
                Phone number
              </label>

              <div className="relative mt-2">

                <Phone
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/30"
                />

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className="focus-ring w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-bark outline-none"
                />

              </div>

            </div>

          </div>


          {/* SAVE PROFILE */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            {saved ? (
              <div className="flex items-center gap-2 text-sm font-medium text-pine">

                <CheckCircle2 size={17} />

                Profile updated successfully!

              </div>
            ) : (
              <p className="text-xs text-bark/40">
                Your changes are currently saved only in this
                frontend demo.
              </p>
            )}

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-pine px-5 py-2.5 text-sm font-medium text-white transition hover:bg-pineDark"
            >
              <Save size={16} />

              Save changes
            </button>

          </div>

        </form>

      </section>


      {/* PASSWORD & SECURITY */}
      <section className="mt-6 rounded-3xl border border-sand bg-white p-6 shadow-sm sm:p-7">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-honey/20 text-bark">
            <Lock size={20} />
          </div>

          <div>

            <h2 className="font-display text-lg font-semibold text-bark">
              Password & security
            </h2>

            <p className="text-xs text-bark/50">
              Keep your FURNEST account secure
            </p>

          </div>

        </div>


        {/* PASSWORD FORM */}
        <form
          onSubmit={handleChangePassword}
          className="mt-6 space-y-5"
        >

          {/* CURRENT PASSWORD */}
          <div>

            <label
              htmlFor="currentPassword"
              className="text-sm font-medium text-bark"
            >
              Current password
            </label>

            <div className="relative mt-2">

              <Lock
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/30"
              />

              <input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) =>
                  setCurrentPassword(e.target.value)
                }
                placeholder="Enter current password"
                className="focus-ring w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-bark outline-none placeholder:text-bark/30"
              />

            </div>

          </div>


          {/* NEW + CONFIRM PASSWORD */}
          <div className="grid gap-5 sm:grid-cols-2">

            {/* NEW PASSWORD */}
            <div>

              <label
                htmlFor="newPassword"
                className="text-sm font-medium text-bark"
              >
                New password
              </label>

              <div className="relative mt-2">

                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/30"
                />

                <input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  className="focus-ring w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-bark outline-none placeholder:text-bark/30"
                />

              </div>

            </div>


            {/* CONFIRM PASSWORD */}
            <div>

              <label
                htmlFor="confirmPassword"
                className="text-sm font-medium text-bark"
              >
                Confirm password
              </label>

              <div className="relative mt-2">

                <Lock
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-bark/30"
                />

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Repeat new password"
                  className="focus-ring w-full rounded-xl border border-sand bg-white py-3 pl-10 pr-4 text-sm text-bark outline-none placeholder:text-bark/30"
                />

              </div>

            </div>

          </div>


          {/* PASSWORD MESSAGE */}
          {passwordMessage && (
            <div
              className={`rounded-xl p-3 text-sm ${
                passwordMessage.includes('successfully')
                  ? 'bg-pine/10 text-pine'
                  : 'bg-rosewood/10 text-rosewood'
              }`}
            >
              {passwordMessage}
            </div>
          )}


          {/* PASSWORD BUTTON */}
          <div className="flex justify-end">

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full border border-pine px-5 py-2.5 text-sm font-medium text-pine transition hover:bg-pine hover:text-white"
            >
              <ShieldCheck size={16} />

              Change password
            </button>

          </div>

        </form>

      </section>


      {/* DEMO NOTICE */}
      <div className="mt-6 rounded-2xl border border-dashed border-sand bg-white/60 p-4 text-center">

        <p className="text-xs leading-5 text-bark/50">
          Account changes are currently simulated in the
          frontend. Real profile and password updates will be
          connected to the backend later.
        </p>

      </div>

    </div>
  )
}