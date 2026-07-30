import React from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "../../config/firebase";

import API from "../../services/api";
import "../../App.css"
import { useState } from "react";
import CircularLoader from "../ui/CircularLoader";
import ErrorToast from "../ui/ErrorToast";
const InstructorLogin = () => {

    const navigate = useNavigate();
    let [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // const { user, fetchUser } = useAuthUser();


    // Google Login
    const handleInstructorLogin = async () => {
        try {
            setLoading(true);
            const result = await signInWithPopup(firebaseAuth, googleProvider);
            const idToken = await result.user.getIdToken();

            const { data } = await API.post(
                "/auth/instructor/google-login",
                { idToken },
                {
                    withCredentials: true,
                }
            );

            console.log(data);

            navigate(`/instructor/profile/${data.user.id}`, {
                state: data.user,
            });

        } catch (err) {
            setError(err.response?.data?.message || err.message || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Logout
    // const handleInstructorLogout = async () => {
    //     try {
    //         // Backend cookie remove
    //         // api/auth/instructor/google-login

    //         await API.post("/auth/instructor/google-logout",
    //             {},
    //             {
    //                 withCredentials: true,
    //             }
    //         );
    //         await signOut(firebaseAuth);

    //         navigate(`/login`);

    //     } catch (err) {
    //         console.log("Logout Error:", err);
    //     }
    // };

    return (
        <div className="auth-option">
            <ErrorToast message={error} onDismiss={() => setError("")} />
            <div className="auth-card instructor__auth">
                    <div className="auth-header">
                        <span className="badge instructor-badge">Instructor</span>

                        <h2>Teach and create</h2>
                        <p>Manage your students, classes, and course content in one place.</p>
                    </div>

                    <button
                        className="google-btn"
                        onClick={handleInstructorLogin}
                        disabled={loading}
                    >
                        <FcGoogle />
                        <span>
                            {loading
                            ? <CircularLoader label="Signing in" />
                                : "Login as instructor with Google"}
                        </span>
                    </button>

            </div>
        </div>
    );
};

export default InstructorLogin;
