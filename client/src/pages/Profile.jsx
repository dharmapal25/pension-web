import React from "react";
import useUsers from "../hooks/useUsers";
import ERROR404 from "../components/ERROR404";

const Instructor = () => {
  const { user, person, loading, error } = useUsers();

  if (loading) {
    return <h2 style={{ textAlign: "center", marginTop: "40px" }}>Loading...</h2>;
  }

  if (!user) {
    return <ERROR404 />;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  const { name, email, role, profileImage } = person;

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
            profileImage ||
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
          <strong>Email:</strong> {email}
        </p>

        <p>
          <strong>Role:</strong> {role}
        </p>

        <p>
          <strong>User ID:</strong> {user?.id}
        </p>
      </div>
    </div>
  );
};

export default Instructor;