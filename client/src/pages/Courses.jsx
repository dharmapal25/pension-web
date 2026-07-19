import React, { useEffect, useState } from 'react'
import axios from 'axios'
import API from '../services/api'
// import './Courses.css'

const Courses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    axios.get(`${API}/courses`)
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
      {/* Navbar */}
      <div className="navbar">
        <div className="logo">CourseBox</div>
        <div className="nav-links">
          <span>Home</span>
          <span>Courses</span>
          <span>offers</span>
        </div>
        <button className="login-btn">login</button>
      </div>

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
            <div className="course-card" key={course._id}>
              <img
                src={course.thumbnail}
                alt={course.title}
                className="course-thumbnail"
              />
              <div className="course-info">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-instructor">{course.instructor?.name}</p>
                <p className="course-price">
                  {course.price === 0 ? 'Free' : `₹${course.price}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Courses