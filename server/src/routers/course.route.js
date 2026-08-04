const express = require("express");
const { getAllCourses, getCourseById, getTrendingCourses } = require("../controllers/course.controller");
const courseRoute = express.Router();


// api/online/courses
courseRoute.get("/courses", getAllCourses);

// api/online/courses/:id
courseRoute.get("/course/:id", getCourseById);

// api/online/courses/trending
courseRoute.get("/courses/trending", getTrendingCourses)
// courseRoute.post("/", verifyToken, createCourse);

module.exports = courseRoute;
