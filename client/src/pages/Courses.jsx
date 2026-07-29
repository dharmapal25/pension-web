import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API from '../services/api'
import "../App.css"

import CoursesCards from '../components/courses/CoursesCards'
import Navbar from '../components/Navbar'
import useGetCourses from '../hooks/GetCourses'

const Courses = () => {
    const { courses, loading, error } = useGetCourses();

    if (loading) return <h2>Loading...</h2>;
    if (error) return <h2>{error}</h2>;
    return (
        <>
        <Navbar />
            <div className="courses-container">
                <CoursesCards />
            </div>
        </>
    )
}

export default Courses