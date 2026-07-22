require("dotenv").config();
const express = require("express");
const cors = require("cors");
// const { dummyCourses } = require("./models/courses.model");

const Routes = require("./routers/payment.route");
const courseRoute = require("./controllers/course.controller");


const app = express();

app.use(express.json());
app.use(cookieStore());
app.use(cors())


app.use("/api/payment",Routes);
app.use("/api/courses", courseRoute);





app.get("/test",(req,res)=> {
    res.json({
        msg : "hello"
    })
})


module.exports = app