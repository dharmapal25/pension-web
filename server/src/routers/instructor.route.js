const express = require("express");
const { LoginUser, LogoutUser, GetCurrentUser } = require("../controllers/auth.controller");
const { uploadCourse } = require("../controllers/instructor.controller");
const upload = require("../middlewares/multer");
const instructorRoute = express.Router()

// api/instructor/upload-course
instructorRoute.post("/upload-course", upload.single('thumbnail'), uploadCourse);

// api/instructor/view-course
// instructorRoute.get("/view-course/:id", viewCourse);


module.exports = instructorRoute;