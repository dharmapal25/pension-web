const express = require("express");
const { studentProfile } = require("../controllers/student.controller");
const studentRoute = express.Router();


// api/student/profile
studentRoute.post("/profile", studentProfile);


// student Id

// api/student/:id
// studentRoute.post()


module.exports = studentRoute