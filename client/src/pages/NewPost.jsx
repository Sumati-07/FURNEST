import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { getPetsByOwner, createPost, getSuggestedPrice } from '../services/api.js'

export default function NewPost() {
  const location = useLocation()
  const [pets, setPets] = useState([])
  const [petId, setPetId] = useState(location.state?.petId || '')
  const [type, setType] = useState('temporary')
  const [city, setCity] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [price, setPrice] = useState('')
  const [suggestion, setSuggestion] = useState(null)
  const [saving, setSaving] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    getPetsByOwner().then((data) => {
      setPets(data)
      if (!petId && data[0]) setPetId(data[0]._id)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const selectedPet = pets.find((p) => p._id === petId)

  useEffect(() => {
    if (type === 'temporary' && city && selectedPet) {
      getSuggestedPrice({ city, species: selectedPet.species }).then((res) => setSuggestion(res.suggestedPricePerDay))
    }
  }, [type, city, selectedPet])

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    await createPost({
      petId,
      type,
      city,
      startDate: type === 'temporary' ? startDate : undefined,
      endDate: type === 'temporary' ? endDate : undefined,
      pricePerDay: type === 'temporary' ? Number(price) : undefined
    })
    setSaving(false)
    navigate('/browse')
  }

  if (pets.length === 0) {
    return (
      <div className="mx-auto max-w-lg px-6 py-12">
        <h1 className="font-display text-2xl font-semibold text-pine">Add a pet first</h1>
        <p className="mt-2 text-bark/70">You need a pet profile before you can post it.</p>
        <Link to="/add-pet" className="mt-4 inline-block rounded-full bg-pine px-5 py-2 text-sm font-medium text-white">
          Add a pet profile
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-12">
      <h1 className="font-display text-2xl font-semibold text-pine">Make a new post</h1>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          Which pet
          <select value={petId} onChange={(e) => setPetId(e.target.value)} className="focus-ring rounded-lg border border-sand bg-white px-3 py-2">
            {pets.map((pet) => (
              <option key={pet._id} value={pet._id}>{pet.name} ({pet.breed})</option>
            ))}
          </select>
        </label>

        <div role="group" className="flex w-fit rounded-full border border-sand bg-white p-1">
          <button type="button" onClick={() => setType('temporary')} className={`rounded-full px-4 py-1.5 text-sm font-medium ${type === 'temporary' ? 'bg-pine text-white' : 'text-bark/70'}`}>
            Temporary care
          </button>
          <button type="button" onClick={() => setType('adoption')} className={`rounded-full px-4 py-1.5 text-sm font-medium ${type === 'adoption' ? 'bg-pine text-white' : 'text-bark/70'}`}>
            Adoption
          </button>
        </div>

        <label className="flex flex-col gap-1.5 text-sm text-bark/80">
          City
          <input required value={city} onChange={(e) => setCity(e.target.value)} className="focus-ring rounded-lg border border-sand bg-white px-3 py-2" />
        </label>

        {type === 'temporary' && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex flex-col gap-1.5 text-sm text-bark/80">
                From
                <input type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="focus-ring rounded-lg border border-sand bg-white px-3 py-2" />
              </label>
              <label className="flex flex-col gap-1.5 text-sm text-bark/80">
                To
                <input type="date" required value={endDate} onChange={(e) => setEndDate(e.target.value)} className="focus-ring rounded-lg border border-sand bg-white px-3 py-2" />
              </label>
            </div>

            <label className="flex flex-col gap-1.5 text-sm text-bark/80">
              Offered price (₹/day)
              <input type="number" min="0" required value={price} onChange={(e) => setPrice(e.target.value)} className="focus-ring rounded-lg border border-sand bg-white px-3 py-2" />
              {suggestion && <span className="text-xs text-pine">Suggested based on similar posts: ₹{suggestion}/day</span>}
            </label>
          </>
        )}

        <button type="submit" disabled={saving} className="focus-ring mt-2 rounded-full bg-honey py-2.5 text-sm font-medium text-bark hover:brightness-95 disabled:opacity-60">
          {saving ? 'Posting…' : 'Post it'}
        </button>
      </form>
    </div>
  )
}
