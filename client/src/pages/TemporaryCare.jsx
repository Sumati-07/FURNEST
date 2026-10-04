import BrowsePets from './BrowsePets.jsx'

export default function TemporaryCare({ currentUser }) {
  return <BrowsePets currentUser={currentUser} typeFilter="temporary" />
}
