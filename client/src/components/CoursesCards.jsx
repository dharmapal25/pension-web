import React from 'react'
import { FaStar } from 'react-icons/fa'

const CoursesCards = ({ course }) => {
  const originalPrice = course.originalPrice || Math.round(course.price * 1.7)

  return (
    <div className="course-card">
      <div className="thumbnail-wrapper">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-thumbnail"
        />
      </div>

      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">{course.instructor?.name}</p>

        <div className="course-meta">
          {course.isBestseller && (
            <span className="bestseller-badge">Bestseller</span>
          )}
          {course.rating && (
            <span className="rating-badge">
              <FaStar className="star-icon" />
              {course.rating}
            </span>
          )}
        </div>

        <div className="price-row">
          <span className="course-price">
            {course.price === 0 ? 'Free' : `₹${course.price}.00`}
          </span>
          {course.price > 0 && (
            <span className="original-price">₹{originalPrice}.00</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CoursesCards