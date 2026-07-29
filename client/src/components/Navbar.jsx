import { signInWithPopup, signOut } from "firebase/auth"
import { Link, useNavigate } from "react-router-dom"
import { auth as firebaseAuth, googleProvider } from "../config/firebase"
import { useAuth } from "../context/AuthContext"
import axios from "axios";
import API from "../services/api";
import useAuthUser from "../hooks/useAuthRole";
import { useEffect } from "react";
const Navbar = () => {

    const navigate = useNavigate()
    const { user, loading } = useAuth()

        const token = useAuthUser();

        console.log(token)

        useEffect(()=> {
            token.fetchUser()
        },[])


    function profileView() {

        navigate(`/${token.user.role}/profile/${token.user.id}`)
        // navigate(`/instructor/profile/${data.user.id}`)
    }

    return (
        <div className="navbar">
            <div className="logo">CourseBox</div>
            <div className="nav-links">
                <Link to="/home">Home</Link>
                <Link to="/courses">Courses</Link>
                <Link to="/offers">offers</Link>
                {
                    (!user) ?

                        <button
                            style={{ color: "#000", background: "#fff", borderRadius: "10px" }}
                            onClick={() => navigate("/login")}>
                            Login
                        </button>
                        :
                        <button
                            style={{ color: "#000", background: "#fff", borderRadius: "10px" }}
                            onClick={profileView}
                        >
                            Profile
                        </button>

                }


            </div>

        </div>
    )
}

export default Navbar
