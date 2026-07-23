const express = require("express");
const { LoginUser, LogoutUser, GetCurrentUser } = require("../controllers/users.controller");
const verifyToken = require("../middlewares/verifyToken.middleware");
const authRoute = express.Router();


authRoute.post("/login", LoginUser);
authRoute.post("/logout", LogoutUser);
authRoute.get("/me", verifyToken, GetCurrentUser);


module.exports = authRoute;
