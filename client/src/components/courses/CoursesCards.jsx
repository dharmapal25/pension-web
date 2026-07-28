import React from 'react'
import { FaStar } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import useGetCourses from '../../hooks/GetCourses';
import "../../App.css"
const CoursesCards = () => {

  const { courses, loading, error } = useGetCourses();
  console.log(courses);

  return (
    <>

      {
        // (!loading) ?

        courses.map((course) => {
          const originalPrice =
            course.discount > 0
              ? Math.round(course.price / (1 - course.discount / 100))
              : course.price;

          return (
            <Link
              key={course._id}
              to={`/courses/${course.category
                .replace(/\s+/g, "-")
                .toLowerCase()}`}
              state={course._id}
              className="course-card-link"
            >
              <div
                className="course-card"
                style={{
                  backgroundColor: course.isBestseller ? "#f9f9f9" : "#fff",
                }}
              >
                <div className="thumbnail-wrapper">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="course-thumbnail"
                  />
                </div>

                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>

                  <p className="course-instructor">
                    {course.instructor?.name || "Unknown Instructor"}
                  </p>

                  <div className="course-meta">
                    {course.isBestseller && (
                      <span className="bestseller-badge">Bestseller</span>
                    )}

                    <span className="rating-badge">
                      <FaStar className="star-icon" />
                      {course.rating?.average || 0}
                      {" ("}
                      {course.rating?.count || 0}
                      {")"}
                    </span>
                  </div>

                  <p>{course.level}</p>
                  <p>{course.language}</p>
                  <p>
                    {course.totalLectures} Lectures • {course.totalDuration} hrs
                  </p>

                  <div className="price-row">
                    <span className="course-price">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </span>

                    {course.discount > 0 && (
                      <>
                        <span className="original-price">
                          ₹{originalPrice}
                        </span>

                        <span className="discount">
                          {course.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          )
        })

        // :

        // ""

      }
    </>
  )
}

export default CoursesCards