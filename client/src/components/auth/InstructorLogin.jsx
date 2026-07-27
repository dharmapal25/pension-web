import React from 'react'
import axios from 'axios';

import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup } from 'firebase/auth';

import { useAuth } from '../../context/AuthContext';
import API from '../../services/api';
import { auth as firebaseAuth, googleProvider } from '../../config/firebase';


const InstructorLogin = () => {

    const navigate = useNavigate()
    const { user, loading } = useAuth()

    async function handleInstructorLogin() {

        try {
            let result = await signInWithPopup(firebaseAuth, googleProvider)

            const idToken = await result.user.getIdToken();

            // role base routes

            // api/instructor/auth/google-login
            await axios.post(`${API}/instructor/auth/google-login`, {
                idToken,
                role: "instructor"
            })

            navigate("/")
        }
        catch (err) {
            console.log("ERROR : ", err)
        }
    }



    return (
        <div>

            {/* Instructor Section */}
            <div className="auth-card instructor__auth">
                <div className="auth-header">
                    <span className="badge instructor-badge">Instructor</span>
                    <h2>Teaching Portal</h2>
                    <p>Manage your students, classes, and course content.</p>
                </div>
                <button
                    className="google-btn"
                    onClick={handleInstructorLogin}
                >
                    <FcGoogle />
                    <span>Login as Instructor with Google</span>
                </button>
            </div>

        </div >
    )
}

export default InstructorLogin