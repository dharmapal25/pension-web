const express = require("express");
const courseRoute = express.Router();

const verifyToken = require("../middlewares/verifyToken");
const requireRole = require("../middlewares/requireRole");
const { getAllCourses, getCourseById, createCourse } = require("../controllers/course.controller");

courseRoute.get("/", getAllCourses);
courseRoute.get("/:id", getCourseById);
courseRoute.post("/", verifyToken, requireRole("instructor", "admin"), createCourse);

module.exports = courseRoute;