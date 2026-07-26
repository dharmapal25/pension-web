import { signInWithPopup, signOut } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { auth as firebaseAuth, googleProvider } from "../config/firebase"
import { useAuth } from "../context/AuthContext"
import axios from "axios";
import API from "../services/api";
const Navbar = () => {

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    async function handleLoginGoogle() {
        try {
            let result = await signInWithPopup(firebaseAuth, googleProvider)

            const idToken = await result.user.getIdToken();

            // role base routes

            // api/instructor/auth/google-login
            await axios.post(`${API}/instructor/auth/google-login`, {
                idToken
            })

            navigate("/")
        }
        catch (err) {
            console.log("ERROR : ", err)
        }
    }

    function handleLogoutGoogle() {

        signOut(firebaseAuth).then(() => {

            await axios.post(`${API}/instructor/auth/google-logout`)
            console.log("User logged out successfully");
            navigate("/");

        }).catch((error) => {
            console.error("Logout error:", error);
        });
    }

    return (
        <div className="navbar">
            <div className="logo">CourseBox</div>
            <div className="nav-links">
                <Link to="/">Home</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/offers">offers</Link>
                {
                    (!user) ?

                        <button
                            style={{ color: "#000", background: "#fff", borderRadius: "10px" }}
                            onClick={handleLoginGoogle}>
                            Login
                        </button>
                        :
                        <button
                            style={{ color: "#000", background: "#fff", borderRadius: "10px" }}
                            onClick={handleLogoutGoogle}>
                            Logout
                        </button>

                }


            </div>

        </div>
    )
}

export default Navbar
