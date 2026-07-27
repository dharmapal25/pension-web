import React from 'react'
import InstructorLogin from '../components/auth/InstructorLogin'
import StundentLogin from '../components/auth/StudentLogin'

const Login = () => {
    return (
        <>
            <h1>Login page</h1>
            <div className="login-dashboard">

                <div className="auth-container">

                    <StundentLogin />
                    <InstructorLogin />
                </div>


            </div>
        </>
    )
}

export default Login