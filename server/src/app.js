const express = require("express");
const cors = require("cors");
const { dummyCourses } = require("./models/courses.model");
const app = express();

app.use(cors())
app.use(express.json());





app.get("/courses",(req,res)=> {

    res.send(dummyCourses)

})



module.exports = app