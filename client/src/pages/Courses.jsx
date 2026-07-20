import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import API from '../services/api'

import '../App.css'
import CoursesCards from '../components/CoursesCards'
import Navbar from '../components/Navbar'

const Courses = () => {
    const [courses, setCourses] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        axios.get(`http://localhost:3000/courses`)
            .then((res) => {
                setCourses(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Error fetching courses:', err)
                setLoading(false)
            })
    }, [])

    const filteredCourses = courses.filter((course) =>
        course.title.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="courses-wrapper">

            <Navbar />

            {/* Filter + Search */}
            <div className="filter-search-row">
                <button className="filter-btn">Filters</button>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search courses"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* Course Grid */}
            <div className="course-grid">
                {loading ? (
                    <p className="status-text">Loading courses...</p>
                ) : filteredCourses.length === 0 ? (
                    <p className="status-text">No courses found.</p>
                ) : (
                    filteredCourses.map((course) => (
                        <CoursesCards key={course._id} course={course} />
                    ))
                )}
            </div>
        </div>
    )
}

export default Courses