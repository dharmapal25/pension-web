import { useEffect, useState } from "react";
import API from "../services/api";

const useGetCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const getCourses = async () => {
      try {
        setLoading(true);

        const { data } = await API.get("/online/courses");
        console.log(data)
        let CourseData = data.courses
        setCourses(CourseData);
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