import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, signOut } from "firebase/auth";

import API from "../../services/api";
import useAuthUser from "../../hooks/useAuthRole";
import { auth as firebaseAuth, googleProvider } from "../../config/firebase";

const StudentLogin = () => {
    const navigate = useNavigate();

    let [loading, setLoading] = useState(false);

    // Google Login
    const handleStudentLogin = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            const idToken = await result.user.getIdToken();

            const { data } = await API.post(
                "/auth/student/google-login",
                { idToken },
                {
                    withCredentials: true,
                }
            );

            console.log(data);

            navigate(`/student/profile/${data.user.id}`, {
                state: data.user,
            });

        } catch (err) {
            console.log("Login Error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const handleStudentLogout = async () => {
        try {
            // Backend cookie remove
            // api/auth/student/google-login
            await API.post("/auth/student/google-logout",
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

            </div>
        </div>
    );
};

export default StudentLogin;