import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="logo">CourseBox</div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/offers">offers</Link>
            </div>
            <button className="login-btn">login</button>
        </div>
    )
}

export default Navbar