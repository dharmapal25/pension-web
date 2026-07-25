const express = require("express");
const courseRoute = express.Router();


// const { getAllCourses, getCourseById, createCourse } = require("../controllers/course.controller");

// courseRoute.get("/", getAllCourses);
// courseRoute.get("/:id", getCourseById);
// courseRoute.post("/", verifyToken, requireRole("instructor", "admin"), createCourse);

module.exports = courseRoute;
