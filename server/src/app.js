require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { dummyCourses } = require("./models/courses.model");
const Routes = require("./routers/payment.route");
const app = express();

app.use(cors())
app.use(express.json());

app.use("/api/payment",Routes);


app.get("/courses", (req, res) => {

    res.json(dummyCourses)

})


app.get("/course",(req,res)=> {
    
})


app.get("/test",(req,res)=> {
    res.json({
        msg : "hello"
    })
})


module.exports = app