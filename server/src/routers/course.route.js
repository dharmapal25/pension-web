const express = require("express");
const { getAllCourses, getCourseById } = require("../controllers/course.controller");
const courseRoute = express.Router();


// api/online/courses
courseRoute.get("/online/courses", getAllCourses);

// api/online/courses/_id
courseRoute.get("/online/courses/:id", getCourseById);


// courseRoute.post("/", verifyToken, createCourse);

module.exports = courseRoute;
