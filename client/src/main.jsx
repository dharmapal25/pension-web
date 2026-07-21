import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import Courses from './pages/Courses.jsx'
import Home from './pages/Home.jsx'
import Offers from './pages/Offers.jsx'
import CourseInfo from './components/courses/CourseInfo.jsx'


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
    path: "/courses/:courseTitle",
    element: <CourseInfo />
  },

  {
    path: "/offers",
    element: <Offers />
  }

])


createRoot(document.getElementById('root')).render(

  <RouterProvider router={AllRoutes} />

)

