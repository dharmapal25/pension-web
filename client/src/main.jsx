import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Courses from './pages/Courses.jsx'
import Home from './pages/Home.jsx'
import Offers from './pages/Offers.jsx'
import CourseInfo from './components/courses/CourseInfo.jsx'
import Login from './components/auth/Login.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import { AuthProvider } from './context/AuthContext.jsx'


const AllRoutes = createBrowserRouter([

  {
    path: "/",
    element: <Home />
  },

  {
    path: "/courses",
    element: <Courses />
  },

  {
    path: "/login",
    element: <Login />
  },
  {
    element: <ProtectedRoute />,
    children: [{
      path: "/courses/:courseTitle",
      element: <CourseInfo />
    }],
  },

  {
    path: "/offers",
    element: <Offers />
  }

])


createRoot(document.getElementById('root')).render(

  <AuthProvider><RouterProvider router={AllRoutes} /></AuthProvider>

)
