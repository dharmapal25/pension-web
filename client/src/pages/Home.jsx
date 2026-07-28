import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import CourseForm from '../components/courses/CourseForm';
import Login from './Login';
import axios from 'axios';

const Home = () => {

  useEffect(() => {
    axios.get("http://localhost:3000/test").then((res) => {
      console.log(res)
    })
  }, [])

  const { user, loading } = useAuth();
  // console.log(user.displayName)
  return (
    <div>
      <Navbar />

      {
        user && (
          <>
            <h1>welcome, {user?.displayName} </h1>
            {/* <CourseForm /> */}

          </>
        )
      }



      <br />
      <br />
      <Login />

    </div>
  )
}

export default Home