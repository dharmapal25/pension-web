import React from 'react'
import { useEffect, useState } from 'react'
import API from '../../services/api'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CircularLoader from '../ui/CircularLoader';
import ErrorToast from '../ui/ErrorToast';

const InstructorLecture = () => {

    const [load, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [course, setCourse] = useState([]);
    const navigate = useNavigate();
    let [id, setId] = useState("");

    useEffect(() => {

        setLoading(true)

        API.get('/instructor/view-course',
            { withCredentials: true, }
        )
            .then((res) => {
                console.log("Response>>> : ", res.data)
                setCourse(res.data.courses.createdCourses);

            }).catch((err) => {
                console.log("Error : ", err)
                setError(err.message || "Something went wrong")

            }).finally(() => {
                setLoading(false)
            })

    }, [])




    return (
        <div>
            <ErrorToast message={error} onDismiss={() => setError("")} />
            {(load) ? <CircularLoader fullPage /> : <h1>Student Lecture</h1>
            }

            <div className="boughtCourses__cards">
                {course.map((elm) => (
                    <div className="bought__course" key={elm._id}>

                        <img
                            src={elm.thumbnail}
                            alt={elm.title}
                            className="course__thumbnail"
                            height={100}
                        />

                        <div className="course__content">
                            <span className="course__category">{elm.category}</span>

                            <h2>{elm.title}</h2>

                            <p>{elm.subtitle}</p>

                            <p>
                                <strong>Language:</strong> {elm.language}
                            </p>

                            <p>
                                <strong>Level:</strong> {elm.level}
                            </p>

                            <p>
                                <strong>Duration:</strong> {elm.totalDuration} Hours
                            </p>

                            <p>
                                <strong>Total Lectures:</strong> {elm.totalLectures}
                            </p>

                            <p>
                                <strong>Price:</strong> ₹{elm.price}
                            </p>

                            <p>
                                ⭐ {elm.rating.average} ({elm.rating.count} Reviews)
                            </p>

                            <div className="course__tags">
                                tags :  {elm.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </div>

                            <button onClick={() => navigate(`/learn/${elm._id}`)} > Lectures </button>

                        </div>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default InstructorLecture
