const express = require("express");
const { instructorLoginGoogle, instructorLogoutGoogle, instructorsAll, studentLoginGoogle, studentLogoutGoogle, studentsAll } = require("../controllers/auth.controller");
const authRoute = express.Router();


// instructor auth

// api/auth/instructor/google-login
authRoute.post("/instructor/google-login",instructorLoginGoogle);

// api/auth/instructor/google-logout
authRoute.post("/instructor/google-logout",instructorLogoutGoogle);

// api/auth/instructor/view-all
authRoute.post("/instructor/view-all",instructorsAll);


// student auth

// api/auth/student/google-login
authRoute.post("/student/google-login",studentLoginGoogle);

// api/auth/student/google-logout
authRoute.post("/student/google-logout",studentLogoutGoogle);

// api/auth/student/view-all
authRoute.post("/student/view-all",studentsAll);


module.exports = authRoute