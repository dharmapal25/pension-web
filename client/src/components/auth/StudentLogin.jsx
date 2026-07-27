import React, { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signOut } from "firebase/auth";

import API from "../../services/api";
import useAuthUser from "../../hooks/useAuthRole";
import { auth as firebaseAuth, googleProvider } from "../../config/firebase";

const StudentLogin = () => {
    const navigate = useNavigate();

    const { _id, role, loading, refetch } = useAuthUser();

    // Login redirect
    useEffect(() => {
        if (!loading && role === "student" && _id) {
            navigate(`/student/${_id}`);
        }
    }, [loading, role, _id, navigate]);

    // Google Login
    const handleStudentLogin = async () => {
        try {
            const result = await signInWithPopup(firebaseAuth, googleProvider);

            const idToken = await result.user.getIdToken();

            await axios.post(
                `${API}/auth/student/google-login`,
                {
                    idToken,
                    role: "student",
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
    const handleStudentLogout = async () => {
        try {
            // Backend cookie remove
            await axios.post(
                `${API}/auth/student/google-logout`,
                {},
                {
                    withCredentials: true,
                }
            );

            // Firebase logout
            await signOut(firebaseAuth);

            await refetch();

            navigate("/student/login");
        } catch (err) {
            console.log("Logout Error:", err);
        }
    };

    return (
        <div>
            <div className="auth-card student__auth">
                <div className="auth-header">
                    <span className="badge student-badge">Student</span>

                    <h2>Teaching Portal</h2>

                    <p>Access your courses, assignments, and learning path.</p>
                </div>

                {role === "student" ? (
                    <button className="google-btn" onClick={handleStudentLogout}>
                        Logout
                    </button>
                ) : (
                    <button
                        className="google-btn"
                        onClick={handleStudentLogin}
                        disabled={loading}
                    >
                        <FcGoogle />
                        <span>
                            {loading
                                ? "Loading..."
                                : "Login as student with Google"}
                        </span>
                    </button>
                )}
            </div>
        </div>
    );
};

export default StudentLogin;