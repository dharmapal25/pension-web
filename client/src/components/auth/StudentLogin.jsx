import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";

import API from "../../services/api";
import { signInWithPopup, signOut } from "firebase/auth";
import useAuthUser from "../../hooks/useAuthRole";
import { auth as firebaseAuth, googleProvider } from "../../config/firebase";

import CircularLoader from "../ui/CircularLoader";
import ErrorToast from "../ui/ErrorToast";

const StudentLogin = () => {
    const navigate = useNavigate();

    let [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
            setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const handleStudentLogout = async () => {
        try {
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
        <div className="auth-option">
            <ErrorToast message={error} onDismiss={() => setError("")} />
            <div className="auth-card student__auth">
                <div className="auth-header">
                    <span className="badge student-badge">Student</span>

                    <h2>Learn new skills</h2>

                    <p>Access your courses and keep your learning momentum going.</p>
                </div>

                <button
                    className="google-btn"
                    onClick={handleStudentLogin}
                    disabled={loading}
                >
                    <FcGoogle />
                    <span>
                        {loading
                            ? <CircularLoader label="Signing in" />
                            : "Login as student with Google"}
                    </span>
                </button>

            </div>
        </div>
    );
};

export default StudentLogin;
