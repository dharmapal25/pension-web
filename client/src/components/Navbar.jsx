import { signInWithPopup } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { auth, googleProvider } from "../config/firebase"

const Navbar = () => {

    const navigate = useNavigate()

    async function handleLoginWithGoogle() {
        try {
            await signInWithPopup(auth, googleProvider)
            navigate("/")
        }
        catch (err) {
            console.log("ERROR : ", err)
        }
    }

    return (
        <div className="navbar">
            <div className="logo">CourseBox</div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/offers">offers</Link>
                <button
                    style={{ color: "#000", background: "#fff", borderRadius: "10px" }}
                    onClick={handleLoginWithGoogle}>
                    Login
                </button>
            </div>

        </div>
    )
}

export default Navbar
