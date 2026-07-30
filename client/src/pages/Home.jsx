import React, { useEffect } from 'react'
import Navbar from '../components/Navbar'
import { useAuth } from '../context/AuthContext'
import CourseForm from '../components/courses/CourseForm';
import Login from './Login';
import axios from 'axios';
import "../App.css"
import API from '../services/api';
const Home = () => {

  useEffect(() => {
    API.get("/instructor/view-course", {
      withCredentials: true,
    })

      .then((res) => {
        console.log("res >> ", res)
      }).catch((err) => {

        console.log("Error >> ", err)
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
      {/* <Login /> */}


    </div>
  )
}

export default Home