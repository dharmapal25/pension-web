const express = require("express");
const { instructorLoginGoogle, instructorLogoutGoogle, instructorsAll } = require("../controllers/auth.controller");
const authRoute = express.Router();

// api/instructor/auth/google-login
authRoute.post("/google-login",instructorLoginGoogle);

// api/instructor/auth/google-logout
authRoute.post("/google-logout",instructorLogoutGoogle);

// api/instructor/view-all
authRoute.post("/view-all",instructorsAll);


module.exports = authRoute