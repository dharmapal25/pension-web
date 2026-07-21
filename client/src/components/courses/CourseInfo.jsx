import React from 'react'

const CourseInfo = () => {
    return (
        <div className="course">

            {/* Left Side */}

            <div className="left">

                <p className="breadcrumb">
                    Business &gt; Business Analytics &gt; SQL
                </p>

                <h1 className="title">
                    The Complete SQL Bootcamp (30 Hours): Go from Zero to Hero
                </h1>

                <p className="desc">
                    The only SQL course with animations, projects and practice to master
                    SQL from beginner to advanced.
                </p>

                <div className="creator">
                    Created by <span>Flash Academy</span>
                </div>

                <div className="info">
                    <span>⭐ 4.7</span>
                    <span>63,348 Students</span>
                    <span>English</span>
                </div>

                <div className="learn-box">

                    <h2>What you'll learn</h2>

                    <div className="grid">

                        <div>✔ Learn SQL Basics</div>
                        <div>✔ SELECT Queries</div>

                        <div>✔ WHERE Clause</div>
                        <div>✔ GROUP BY</div>

                        <div>✔ JOINS</div>
                        <div>✔ Aggregate Functions</div>

                        <div>✔ Window Functions</div>
                        <div>✔ Real Projects</div>

                    </div>

                </div>

            </div>

            {/* Right Side */}

            <div className="right">

                <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"
                    alt=""
                />

                <h2>₹469</h2>

                <button>Buy Now</button>

                <button className="outline">
                    Add To Cart
                </button>

                <ul>

                    <li>✔ Lifetime Access</li>
                    <li>✔ Certificate</li>
                    <li>✔ Downloadable Resources</li>
                    <li>✔ Full HD Videos</li>

                </ul>

            </div>

        </div>
    )
}

export default CourseInfo