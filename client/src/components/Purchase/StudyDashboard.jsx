import React from 'react'
import { useEffect } from 'react';
import { useState } from 'react';
import API from '../../services/api';

const StudyDashboard = () => {


    const [load, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [course, setCourse] = useState([]);

    useEffect(() => {

        setLoading(true)

        API.get('/student/view-courses',
            { withCredentials: true, }
        )
            .then((res) => {
                console.log("Response : ", res.data.Course.boughtCourses)
                setCourse(res.data.Course.boughtCourses);

            }).catch((err) => {
                console.log("Error : ", err)
                // setError(err.message || "Something went wrong")

            }).finally(() => {
                setLoading(false)
            })

    }, [])



    return (
        <div>
            {course.map((courseItem) => (
                <div key={courseItem._id}>
                    <h2>{courseItem.title}</h2>

                    {courseItem.lectures.map((lecture) => (
                        <div key={lecture._id}>
                            <h4>{lecture.title}</h4>
                            <p>Duration: {lecture.duration} min</p>

                            <a
                                href={lecture.videoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Watch Video
                            </a>
                        </div>
                    ))}
                </div>
            ))}
        </div>
    )
}

export default StudyDashboard