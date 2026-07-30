import React from "react";
import { FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../../App.css";

const CoursesCards = ({ courses = [] }) => courses.map((course) => {
  const originalPrice = course.discount > 0 ? Math.round(course.price / (1 - course.discount / 100)) : course.price;
  return <Link
    key={course._id}
    to={`/courses/${course.category.replace(/\s+/g, "-").toLowerCase()}`}
    state={course._id}
    className="course-card-link">

    <article className="course-card">
      <div className="thumbnail-wrapper">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="course-thumbnail"
          loading="lazy" />
      </div>

      <div className="course-info">
        <h3 className="course-title">{course.title}</h3>
        <p className="course-instructor">
          {course.instructor?.name || "Unknown Instructor"}
        </p>

        <div className="course-meta">
          {course.isBestseller && <span className="bestseller-badge">Bestseller</span>}
          <span className="rating-badge">
            <FaStar className="star-icon" />
            {course.rating?.average || 0} ({course.rating?.count || 0})
          </span>
        </div>

        <div className="course-details">
          <span>{course.level || "All levels"}</span>
          <span>{course.language || "English"}</span>
        </div>
        <p className="course-duration">
          {course.totalLectures || 0} lectures
          <span>•</span> {course.totalDuration || 0} hrs
        </p>

        <div className="price-row">
          <span className="course-price">
            {course.price === 0 ? "Free" : `₹${course.price}`}
          </span>
          {
            course.discount > 0 &&
            <>
              <span className="original-price">₹{originalPrice}</span>
              <span className="discount">{course.discount}% OFF</span>
            </>
          }
        </div>
      </div>
    </article>
  </Link>;
});

export default CoursesCards;
