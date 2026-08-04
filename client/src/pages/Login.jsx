import React from 'react'
import { HiSparkles } from 'react-icons/hi'
import { Link } from 'react-router-dom'
import InstructorLogin from '../components/auth/InstructorLogin'
import StundentLogin from '../components/auth/StudentLogin'
import logo from "../../public/logo.png"

const Login = () => {
    return (
        <main className="login-dashboard">
            <section className="login-shell">

                <div className="login-intro">

                    <div className="login-topbar">
                        <div className="login-brand">
                            <Link className="logo" to="/home">
                                <img src={logo} height={"60px"} />
                            </Link>

                        </div>

                    </div>

                    <p className="eyebrow">One place to grow</p>

                    <h1>Start building your
                        <span> future.</span>
                    </h1>

                    <p>Choose how you want to use CourseBox today. You can learn new skills or share what you know.</p>

                    <div className="login-note">
                        <HiSparkles aria-hidden="true" />
                        Secure, quick sign-in with Google
                    </div>

                </div>
                <div className="auth-container">
                    <div className="auth-container-heading">
                        <p className="eyebrow">
                            Welcome to CourseBox
                        </p>
                        <h2>Continue as</h2>
                        <p>Choose your workspace to get started.</p>
                    </div>


                    <div className="auth-options">
                        <StundentLogin />
                        <InstructorLogin />
                    </div>
                </div>
            </section>
        </main>
    )
}

export default Login
