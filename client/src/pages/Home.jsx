import React from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import CourseForm from '../components/courses/CourseForm';

const Home = () => {

  const { user, loading } = useAuth();
  // console.log(user.displayName)
  return (
    <div>
      <Navbar />

      {
        user && (
          <>
            <h1>welcome, {user?.displayName} </h1>
            <CourseForm />
          </>
        )
      }

    </div>
  )
}

export default Home