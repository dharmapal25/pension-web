import React from 'react'
import { FcGoogle } from "react-icons/fc";

const StundentLogin = () => {
  return (

    //  Student Section 
    <div className="auth-card student__auth">
      <div className="auth-header">
        <span className="badge student-badge">Student</span>
        <h2>Welcome Back!</h2>
        <p>Access your courses, assignments, and learning path.</p>
      </div>
      <button
        className="google-btn"
        onClick={() => handleGoogleLogin('student')}
      >
        <FcGoogle />
        <span>Login as Student with Google</span>
      </button>
    </div>


  )
}

export default StundentLogin