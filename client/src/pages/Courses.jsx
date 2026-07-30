import React, { useMemo, useState } from "react";
import { HiAdjustments, HiSearch } from "react-icons/hi";
import "../App.css";
import CoursesCards from "../components/courses/CoursesCards";
import Navbar from "../components/Navbar";
import useGetCourses from "../hooks/GetCourses";
import CircularLoader from "../components/ui/CircularLoader";
import ErrorToast from "../components/ui/ErrorToast";

const Courses = () => {
  const { courses, loading, error } = useGetCourses();
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All levels");

  const filteredCourses = useMemo(() => courses.filter((course) => {
    const text = `${course.title} ${course.instructor?.name || ""} ${course.category || ""}`.toLowerCase();
    return text.includes(query.toLowerCase()) && (level === "All levels" || course.level === level);
  }), [courses, query, level]);

  if (loading) return <CircularLoader fullPage />;

  return <>
    <ErrorToast message={error} />
    <Navbar />
    <main className="courses-page">
      <section className="courses-hero">
        <p className="eyebrow">Grow at your own pace</p>
        <h1>Find your next <span>big skill.</span></h1>
        <p className="hero-copy">Practical courses designed to help you build confidence, create more, and move your career forward.</p>

        <div className="course-search" role="search">
          <HiSearch aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="What do you want to learn?"
            aria-label="Search courses" />
        </div>
      </section>

      <section className="courses-section" aria-labelledby="all-courses-heading">
        <div className="courses-toolbar">
          <div>
            <p className="eyebrow">Curated for you</p>
            <h2 id="all-courses-heading">Explore all courses</h2>
            <p className="course-count">{filteredCourses.length} course{filteredCourses.length !== 1 ? "s" : ""} available</p>
          </div>

          <label className="level-filter">
            <HiAdjustments aria-hidden="true" />
            <span className="sr-only">Filter by level</span>
            <select value={level} onChange={(event) => setLevel(event.target.value)}>
              <option>All levels</option>
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </label>

        </div>

        <div className="courses-container">
          <CoursesCards courses={filteredCourses} />
        </div>

        {
          !filteredCourses.length &&
          <div className="empty-courses">No courses match your search. Try a different keyword.
          </div>
        }
        
      </section>
    </main>
  </>;
};

export default Courses;
