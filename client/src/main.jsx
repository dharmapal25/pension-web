import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'

import Courses from './pages/Courses.jsx'
import Home from './pages/Home.jsx'
import Offers from './pages/Offers.jsx'

import CourseInfo from './components/courses/OpenCourse.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import Instructor from './pages/Profile.jsx'
import StudyDashboard from './components/Purchase/StudyDashboard.jsx'
import ERROR404 from './components/ERROR404.jsx'


const AllRoutes = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/home" replace />,
  },

  {
    path: "/home",
    element:
      <Home />
  },

  {
    path: "/login",
    element: <Login />
  },
  
  {
    path: "/courses",
    element: <Courses />
  },

  {
    path: "/courses/:courseTitle",
    element: <CourseInfo />
  },

  {
    path: "/offers",
    element:
      <ProtectedRoute>
        <Offers />
      </ProtectedRoute>
  },

  {
    path: "/:role/profile/:id",
    element:
      <ProtectedRoute>
        <Instructor />
      </ProtectedRoute>
  },
  {
    path: "learn/:id",
    element:
      <ProtectedRoute>
        <StudyDashboard />
      </ProtectedRoute>
  },
  {
    path: "*",
    element:
        <ERROR404 />
  },





])

createRoot(document.getElementById('root')).render(
  <AuthProvider> {/* 1-step parent */}
    <RouterProvider router={AllRoutes} />
  </AuthProvider>

)
