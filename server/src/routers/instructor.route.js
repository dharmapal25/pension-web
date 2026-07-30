const express = require("express");
const { uploadCourse, viewCourse } = require("../controllers/instructor.controller");
const upload = require("../middlewares/multer");
const verifyToken = require("../middlewares/verifyToken");
const instructorRoute = express.Router()

// api/instructor/upload-course
instructorRoute.post("/upload-course", verifyToken, upload.single('thumbnail'), uploadCourse);

// api/instructor/view-course
instructorRoute.get("/view-course", verifyToken, viewCourse)


module.exports = instructorRoute;