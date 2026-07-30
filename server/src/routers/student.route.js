const express = require("express");
const { studentProfile, studentCourses } = require("../controllers/student.controller");
const verifyToken = require("../middlewares/verifyToken");
const studentRoute = express.Router();


// api/student/profile
studentRoute.post("/profile", studentProfile);


// api/student/view-courses
studentRoute.get("/view-courses", verifyToken, studentCourses);


module.exports = studentRoute