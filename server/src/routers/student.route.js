const express = require("express");
const { studentProfile } = require("../controllers/student.controller");
const studentRoute = express.Router();


// api/student/profile
studentRoute.post("/student/profile", studentProfile);


// student payment process

// api/student/courses/:id
studentRoute.post()