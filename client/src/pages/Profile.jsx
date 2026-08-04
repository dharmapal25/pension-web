import React from "react";
import useUsers from "../hooks/useUsers";
import ERROR404 from "../components/ERROR404";
import CourseForm from "../components/courses/CourseForm";
import API from "../services/api";
import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "../config/firebase";
import StudentLecture from "../components/Purchase/StudentLecture";
import InstructorLecture from "../components/Purchase/InstructorLecture";
import CircularLoader from "../components/ui/CircularLoader";
import ErrorToast from "../components/ui/ErrorToast";

const Instructor = () => {
  const { user, person, loading, error } = useUsers();

  const [load, setLoad] = useState(false);

  if (loading) {
    return <CircularLoader fullPage />;
  }

  if (!user) {
    return <ERROR404 />;
  }

  if (error) {
    return <ErrorToast message={error} />;
  }


  // Logout
  const handleInstructorLogout = async () => {
    try {
      setLoad(true)
      // Backend cookie remove
      // api/auth/instructor/google-login   | student

      await API.post(`/auth/${person.student.role}/google-logout`,
        {},
        {
          withCredentials: true,
        }
      );
      await signOut(firebaseAuth);

      navigate(`/login`);

    } catch (err) {
      console.log("Logout Error:", err);
    } finally {
      setLoad(false)
    }
  };



  return (
    <main className="profile-page">
      <section className="profile-card">
        <div className="profile-cover" />
        <Link className="profile-back" to="/home">← Back to home</Link>
        <div className="profile-content">
          <div className="avatar-frame">
            <img src={person.student.profileImage || "https://via.placeholder.com/120"} alt="Profile" className="profile-avatar" />
          </div>
          <span className="profile-role">{person.student.role}</span>
          <h1>{person.student.name || "No Name"}</h1>
          <p className="profile-email">{person.student.email}</p>
          <div className="profile-details">
            <div><span>Account type</span><strong>{person.student.role}</strong></div>
            <div><span>User ID</span><strong title={user?.id}>{user?.id}</strong></div>
            {
              person.student.role == "instructor" &&
              <Link to={"/instructor/upload-course"}>
                <button className="upload-course"  >Upload course</button>
              </Link>
            }
          </div>
        </div>
      </section>

      <section className="profile-learning">
        <div className="profile-learning-header">

          <div>
            <p className="eyebrow">Your space</p>
            <h2>{person.student.role === "student" ? "Your learning library" : "Your course library"}</h2>
          </div>

          <div className="logout-section">
            <button className="logout-button" onClick={handleInstructorLogout}>
              {
                (!load) ?
                  "Logout"
                  :
                  "loading..."
              }
            </button>
          </div>
        </div>
        {person.student.role == "student" && <StudentLecture />}
        {person.student.role == "instructor" && <InstructorLecture />}
      </section>
    </main>
  );
};

export default Instructor;
