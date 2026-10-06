import { useEffect, useState } from 'react'
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from 'react-router-dom'

import Sidebar from './components/Sidebar.jsx'
import TopBar from './components/TopBar.jsx'

import LandingPage from './pages/LandingPage.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import Dashboard from './pages/Dashboard.jsx'
import BrowsePets from './pages/BrowsePets.jsx'
import MyPets from './pages/MyPets.jsx'
import AddPet from './pages/AddPet.jsx'
import TemporaryCare from './pages/TemporaryCare.jsx'
import NewPost from './pages/NewPost.jsx'
import MyBookings from './pages/MyBookings.jsx'
import BookingDetails from './pages/BookingDetails.jsx'
import Chats from './pages/Chats.jsx'
import Reviews from './pages/Reviews.jsx'
import Applicants from './pages/Applicants.jsx'
import Settings from './pages/Settings.jsx'

import {
  getCurrentUser,
  logout as apiLogout,
} from './services/api.js'


// ======================================================
// ADMIN IMPORTS
// ======================================================

import AdminLogin from './admin/pages/AdminLogin.jsx'
import AdminDashboard from './admin/pages/AdminDashboard.jsx'
import AdminSidebar from './admin/components/AdminSidebar.jsx'

import {
  isAdminLoggedIn,
} from './admin/services/adminApi.js'


// ======================================================
// USER APP LAYOUT
// ======================================================

function AppLayout({
  currentUser,
  onLogout,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  return (
    <div className="min-h-screen bg-meadow sm:flex">

      <Sidebar
        open={sidebarOpen}
        onLogout={onLogout}
      />

      <div className="flex-1">

        <TopBar
          onToggleSidebar={() =>
            setSidebarOpen((v) => !v)
          }
          currentUser={currentUser}
        />

        <Outlet
          context={{
            currentUser,
          }}
        />

      </div>

    </div>
  )
}


// ======================================================
// ADMIN LAYOUT
// ======================================================

function AdminLayout() {
  return (
    <div className="min-h-screen bg-meadow flex">

      <AdminSidebar />

      <main className="min-w-0 flex-1">

        <Outlet />

      </main>

    </div>
  )
}


// ======================================================
// APP
// ======================================================

export default function App() {

  const [currentUser, setCurrentUser] =
    useState(null)

  const [checkingSession, setCheckingSession] =
    useState(true)


  // ====================================================
  // CHECK NORMAL USER SESSION
  // ====================================================

  useEffect(() => {

    const token =
      localStorage.getItem(
        'furnest_token'
      )

    if (!token) {

      setCheckingSession(false)

      return
    }

    getCurrentUser()
      .then(setCurrentUser)
      .catch(() => {

        localStorage.removeItem(
          'furnest_token'
        )

      })
      .finally(() => {

        setCheckingSession(false)

      })

  }, [])


  // ====================================================
  // NORMAL USER LOGIN
  // ====================================================

  function handleLogin(
    _token,
    user
  ) {
    setCurrentUser(user)
  }


  // ====================================================
  // NORMAL USER LOGOUT
  // ====================================================

  function handleLogout() {

    apiLogout()

    setCurrentUser(null)
  }


  // ====================================================
  // WAIT FOR SESSION CHECK
  // ====================================================

  if (checkingSession) {
    return null
  }


  const isAuthed =
    !!currentUser


  // ====================================================
  // ROUTES
  // ====================================================

  return (
    <Routes>


      {/* ==================================================
          ADMIN LOGIN
      ================================================== */}

      <Route
        path="/admin/login"
        element={
          isAdminLoggedIn() ? (
            <Navigate
              to="/admin/dashboard"
              replace
            />
          ) : (
            <AdminLogin />
          )
        }
      />


      {/* ==================================================
          ADMIN PROTECTED ROUTES
      ================================================== */}

      <Route
        element={
          isAdminLoggedIn() ? (
            <AdminLayout />
          ) : (
            <Navigate
              to="/admin/login"
              replace
            />
          )
        }
      >

        <Route
          path="/admin/dashboard"
          element={
            <AdminDashboard />
          }
        />

      </Route>


      {/* ==================================================
          PUBLIC USER ROUTES
      ================================================== */}

      <Route
        path="/"
        element={
          isAuthed ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <LandingPage />
          )
        }
      />


      <Route
        path="/login"
        element={
          isAuthed ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <Login
              onLogin={handleLogin}
            />
          )
        }
      />


      <Route
        path="/register"
        element={
          isAuthed ? (
            <Navigate
              to="/dashboard"
              replace
            />
          ) : (
            <Register
              onLogin={handleLogin}
            />
          )
        }
      />


      <Route
        path="/forgot-password"
        element={
          <ForgotPassword />
        }
      />


      {/* ==================================================
          PROTECTED USER ROUTES
      ================================================== */}

      <Route
        element={
          isAuthed ? (
            <AppLayout
              currentUser={currentUser}
              onLogout={handleLogout}
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      >


        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Dashboard
              currentUser={currentUser}
            />
          }
        />


        {/* Browse Pets */}
        <Route
          path="/browse"
          element={
            <BrowsePets
              currentUser={currentUser}
            />
          }
        />


        {/* My Pets */}
        <Route
          path="/my-pets"
          element={
            <MyPets
              currentUser={currentUser}
            />
          }
        />


        {/* Add Pet */}
        <Route
          path="/add-pet"
          element={
            <AddPet
              currentUser={currentUser}
            />
          }
        />


        {/* Temporary Care */}
        <Route
          path="/temporary-care"
          element={
            <TemporaryCare
              currentUser={currentUser}
            />
          }
        />


        {/* New Post */}
        <Route
          path="/new-post"
          element={
            <NewPost
              currentUser={currentUser}
            />
          }
        />


        {/* My Bookings */}
        <Route
          path="/bookings"
          element={
            <MyBookings
              currentUser={currentUser}
            />
          }
        />


        {/* Booking Details */}
        <Route
          path="/bookings/:bookingId"
          element={
            <BookingDetails
              currentUser={currentUser}
            />
          }
        />


        {/* Chats */}
        <Route
          path="/chats"
          element={
            <Chats
              currentUser={currentUser}
            />
          }
        />


        {/* Reviews */}
        <Route
          path="/reviews"
          element={
            <Reviews
              currentUser={currentUser}
            />
          }
        />


        {/* Settings */}
        <Route
          path="/settings"
          element={
            <Settings
              currentUser={currentUser}
            />
          }
        />


        {/* Applicants */}
        <Route
          path="/posts/:postId/applications"
          element={
            <Applicants />
          }
        />

      </Route>

    </Routes>
  )
}