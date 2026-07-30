import React from "react";
import useUsers from "../hooks/useUsers";
import ERROR404 from "../components/ERROR404";
import CourseForm from "../components/courses/CourseForm";
import API from "../services/api";
import { useState } from "react";
import { signInWithPopup, signOut } from "firebase/auth";
import { auth as firebaseAuth, googleProvider } from "../config/firebase";

const Instructor = () => {
  const { user, person, loading, error } = useUsers();

  const[load,setLoad] = useState(false);

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;
  }

  if (!user) {
    return <ERROR404 />;
  }

  if (error) {
    return <h2>{error}</h2>;
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
        }finally{
          setLoad(false)
        }
    };



  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "50px",
      }}
    >
      <div
        style={{
          width: "350px",
          padding: "25px",
          border: "1px solid #ddd",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          textAlign: "center",
          background: "#fff",
        }}
      >
        <img
          src={
            person.student.profileImage ||
            "https://via.placeholder.com/120"
          }
          alt="Profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "20px",
          }}
        />

        <h2>{name || "No Name"}</h2>

        <p>
          <strong>Email:</strong> {person.student.email}
        </p>

        <p>
          <strong>Role:</strong> {person.student.role}
        </p>

        <p>
          <strong>User ID:</strong> {user?.id}
        </p>
      </div>

      <div className="logout-section">
        <button onClick={handleInstructorLogout}  >
          {
            (!load) ?
            "Logout"
            :
            "loading..."
          }
        </button>
      </div>

      {
        person.student.role == "instructor" && <CourseForm />
      }

    </div>
  );
};

export default Instructor;