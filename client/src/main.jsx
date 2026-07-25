import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Courses from './pages/Courses.jsx'
import Home from './pages/Home.jsx'
import Offers from './pages/Offers.jsx'

import CourseInfo from './components/courses/CourseInfo.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


const AllRoutes = createBrowserRouter([

  {
    path: "/",
    element:
      // <ProtectedRoute>
      <Home />
    // </ProtectedRoute>
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
  }

])

createRoot(document.getElementById('root')).render(
  <AuthProvider> {/* 1-step parent */}
    <RouterProvider router={AllRoutes} />
  </AuthProvider>

)
