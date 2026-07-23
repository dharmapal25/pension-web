require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const Routes = require("./routers/payment.route");
const courseRoute = require("./routers/course.route");
const authRoute = require("./routers/users.route");


const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));


app.use("/api/payment",Routes);
app.use("/api/courses", courseRoute);
app.use("/api/auth",authRoute);




app.get("/test",(req,res)=> {
    res.json({
        msg : "hello"
    })
})


module.exports = app
