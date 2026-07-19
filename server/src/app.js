const express = require("express");
const cors = require("cors");
const { dummyCourses } = require("./models/courses.model");
const app = express();

app.use(cors())
app.use(express.json());





app.get("/courses", (req, res) => {

    res.json(dummyCourses)
    // res.json({ message: "hello" })

})


app.get("/test",(req,res)=> {
    res.json({
        msg : "hello"
    })
})


module.exports = app