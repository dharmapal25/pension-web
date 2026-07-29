import { useEffect, useState } from "react";
import API from "../services/api";
import useAuthUser from "./useAuthRole";

const useUsers = () => {
  const { user, fetchUser } = useAuthUser();

  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load logged-in user
  useEffect(() => {
    fetchUser();
  }, []);

  // Fetch profile after user is available
  useEffect(() => {
    if (user?.id) {
      fetchPerson(user.id);
    }
  }, [user]);

  const fetchPerson = async (id) => {
    try {
      setLoading(true);

      const { data } = await API.post("/student/profile", {
        id,
      });

      console.log("Profile :", data);

      setPerson(data);
      setError("");
    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    person,
    loading,
    error,
    refetch: () => fetchPerson(user?.id),
  };
};

export default useUsers;