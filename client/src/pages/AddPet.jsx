import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createPetProfile } from '../services/api.js'

const initial = { name: '', species: 'Dog', breed: '', age: '', healthNotes: '', photo: '' }

export default function AddPet() {
  const [form, setForm] = useState(initial)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await createPetProfile({ ...form, age: Number(form.age) })
    setSaving(false)
    navigate('/my-pets')
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-pine">Add a pet profile</h1>
      <p className="mt-1 text-bark/70">Every pet needs its own profile before it can be posted for adoption or care.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Name
          <input
            required
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-sm text-bark/80">
            Species
            <select
              value={form.species}
              onChange={(e) => update('species', e.target.value)}
              className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
            >
              <option>Dog</option>
              <option>Cat</option>
              <option>Bird</option>
              <option>Other</option>
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm text-bark/80">
            Age (years)
            <input
              type="number"
              min="0"
              required
              value={form.age}
              onChange={(e) => update('age', e.target.value)}
              className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
            />
          </label>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Breed
          <input
            value={form.breed}
            onChange={(e) => update('breed', e.target.value)}
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Photo URL
          <input
            value={form.photo}
            onChange={(e) => update('photo', e.target.value)}
            placeholder="https://…"
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Health notes
          <textarea
            rows={3}
            value={form.healthNotes}
            onChange={(e) => update('healthNotes', e.target.value)}
            placeholder="Vaccinations, allergies, temperament…"
            className="focus-ring rounded-lg border border-sand bg-white px-3 py-2"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="focus-ring mt-2 rounded-full bg-honey py-2.5 text-sm font-medium text-bark hover:brightness-95 disabled:opacity-60"
        >
          {saving ? 'Saving…' : 'Save pet profile'}
        </button>
      </form>
    </div>
  )
}
