require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const Routes = require("./routers/payment.route");
const courseRoute = require("./routers/course.route");
const instructorRoute = require("./routers/instructor.route");
const verifyToken = require("./middlewares/verifyToken");
const Course = require("./models/courses.model");
const authRoute = require("./routers/auth.route");
const studentRoute = require("./routers/student.route");
const User = require("./models/users.model");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
}));


app.use("/api/payment", Routes);
app.use("/api/instructor", instructorRoute);

app.use("/api/online", courseRoute);

// api/auth/instructor/google-login
app.use("/api/auth", authRoute);

app.use("/api/student",  studentRoute)


// app.get("/api/test",verifyToken, async (req, res) => {
app.get("/api/test", async (req, res) => {

    let data = await User.find()
    // let data = req.user

    res.json({
        msg: "hello",
        data
    })
})


app.get("/api/auth/me", verifyToken, (req, res) => {
    res.json({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
    });
})


module.exports = app;