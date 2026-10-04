import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getPetsByOwner } from '../services/api.js'

export default function MyPets() {
  const [pets, setPets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPetsByOwner().then((data) => {
      setPets(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-semibold text-pine">My pets</h1>
          <p className="mt-1 text-sm text-bark/70">Every pet profile you've created.</p>
        </div>
        <Link to="/add-pet" className="rounded-full bg-pine px-4 py-2 text-sm font-medium text-white hover:bg-pineDark">
          + Add pet
        </Link>
      </div>

      {loading ? (
        <p className="text-sm text-bark/50">Loading…</p>
      ) : pets.length === 0 ? (
        <p className="text-sm text-bark/50">No pets yet — add one to get started.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {pets.map((pet) => (
            <div key={pet._id} className="overflow-hidden rounded-card border border-sand bg-white">
              {pet.photo && <img src={pet.photo} alt={pet.name} className="h-36 w-full object-cover" />}
              <div className="p-4">
                <p className="font-display text-lg font-semibold text-bark">{pet.name}</p>
                <p className="text-sm text-bark/60">{pet.species} · {pet.breed} · {pet.age} yrs</p>
                <Link
                  to="/new-post"
                  state={{ petId: pet._id }}
                  className="mt-2 inline-block text-xs font-medium text-pine hover:underline"
                >
                  List this pet →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
