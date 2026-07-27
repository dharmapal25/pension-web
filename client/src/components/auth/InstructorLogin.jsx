import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signOut } from "firebase/auth";

import API from "../../services/api";
import useAuthUser from "../../hooks/useAuthRole";
import { auth as firebaseAuth, googleProvider } from "../../config/firebase";

const InstructorLogin = () => {
    const navigate = useNavigate();

    const { _id, role, loading, refetch } = useAuthUser();

    // Login redirect
    useEffect(() => {
        if (!loading && role === "instructor" && _id) {
            navigate(`/instructor/${_id}`);
        }
    }, [loading, role, _id, navigate]);

    // Google Login
    const handleInstructorLogin = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);

            const idToken = await result.user.getIdToken();

            await axios.post(
                `${API}/instructor/auth/google-login`,
                {
                    idToken,
                    role: "instructor",
                },
                {
                    withCredentials: true,
                }
            );

            await refetch();
        } catch (err) {
            console.log("Login Error:", err);
        }
    };

    // Logout
    const handleInstructorLogout = async () => {
        try {
            // Backend cookie remove
            await axios.post(
                `${API}/instructor/auth/google-logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            // Firebase logout
            await signOut(firebaseAuth);

            await refetch();

            navigate("/instructor/login");
        } catch (err) {
            console.log("Logout Error:", err);
        }
    };

    return (
        <div>
            <div className="auth-card instructor__auth">
                <div className="auth-header">
                    <span className="badge instructor-badge">Instructor</span>

                    <h2>Teaching Portal</h2>

                    <p>Manage your students, classes, and course content.</p>
                </div>

                {role === "instructor" ? (
                    <button className="google-btn" onClick={handleInstructorLogout}>
                        Logout
                    </button>
                ) : (
                    <button
                        className="google-btn"
                        onClick={handleInstructorLogin}
                        disabled={loading}
                    >
                        <FcGoogle />
                        <span>
                            {loading
                                ? "Loading..."
                                : "Login as Instructor with Google"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstructorLogin;