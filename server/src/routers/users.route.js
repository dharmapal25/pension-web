const express = require("express");
const { LoginUser, LogoutUser, GetCurrentUser } = require("../controllers/users.controller");
const authRoute = express.Router();


authRoute.post("/login", LoginUser);
authRoute.post("/logout", LogoutUser);
// authRoute.get("/me", verifyToken, GetCurrentUser);


module.exports = authRoute;
