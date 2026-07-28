import { useEffect, useState } from "react";
import axios from "axios";
import API from "../services/api";

const useGetCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);

        const { data } = await axios.get(`${API}/online/courses`);

        setCourses(data);
      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    getCourses();
  }, []);

  return {
    courses,
    loading,
    error,
  };
};

export default useGetCourses;