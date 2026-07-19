import React from 'react'

const CoursesCards = ({ course }) => {

    console.log(course, "course in card")

    return (
        <div>

            <div className="course-card">
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



        </div>
    )
}

export default CoursesCards