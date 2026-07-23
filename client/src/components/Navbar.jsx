import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const handleLogout = async () => { await logout(); navigate('/'); };
    return (
        <div className="navbar">
            <div className="logo">CourseBox</div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/offers">offers</Link>
            </div>
            {user ? <button className="login-btn" onClick={handleLogout}>Logout ({user.name})</button> : <Link className="login-btn" to="/login">Login</Link>}
        </div>
    )
}

export default Navbar
