import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import CourseForm from '../components/courses/CourseForm';
import "../App.css"
import API from '../services/api';

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Link } from 'react-router-dom';
import CircularLoader from '../components/ui/CircularLoader';
import { FaStar } from 'react-icons/fa';

const Home = () => {

  const [load, setLoad] = useState(false);
  const [course, setCourse] = useState([]);

  useEffect(() => {
    setLoad(true)
    API.get("/online/courses/trending", {
      withCredentials: true,
    })

      .then((res) => {
        console.log("res >> ", res.data.courses)
        setCourse(res.data.courses);
      }).catch((err) => {

        console.log("Error >> ", err)
      }).finally(() => {
        setLoad(false)
      })
  }, [])


  // console.log(user.displayName)
  console.log(course)
  return (
    <>

      {
        (load) ? <CircularLoader fullPage /> :
          <div>

            <Navbar />

            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              grabCursor={true}
              loop={true}
              speed={600}
            >
              {course.map((courses, idx) => {
                return (
                  <SwiperSlide>
                    <img src={courses.thumbnail} alt="" srcset="" height={"290px"} className='swiper' loading='lazy' key={idx} />
                  </SwiperSlide>
                )
              })}
            </Swiper>
            <br />
            <br />
            <br />
            <h1>Trending courses</h1>

                <div className="home-container">
                  {course.map((course) => {
 
                    return (
                      <div key={course._id} className="course-card">
                        {/* Thumbnail Image */}
                        <div className="card-image-wrapper">
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="card-image"
                          />
                        </div>

                        {/* Card Content */}
                        <div className="card-content">
                          <h3 className="card-title">{course.title}</h3>

                          <p className="card-instructor">
                            {typeof course.instructor === 'string' ? 'Unknown Instructor' : course.instructor?.name || 'Unknown Instructor'}
                          </p>

                          {/* Rating */}
                          <div className="card-rating">
                            <span className="star">★</span>
                            <span className="rating-score">{course.rating?.average || 4.6}</span>
                            <span className="rating-count">({course.rating?.count || 85})</span>
                          </div>

                          {/* Meta Info: Lectures & Duration */}
                          <div className="card-meta">
                            <span>{course.totalLectures || course.lectures?.length || 1} lectures</span>
                            <span className="dot">•</span>
                            <span>{course.totalDuration || 25} hrs</span>
                          </div>

                          
                         
                        </div>
                      </div>
                    );
                  })}
                </div>
              )



            <br />
            <br />

          </div>
      }
    </>
  )
}

export default Home