const Course = require("../models/courses.model");

const createCourse = async (req, res) => {
    try {

        const course = await Course.create({
            ...req.body,
            instructor: req.user.id, // from verifyToken middleware
        });

        res.status(201).json({ success: true, course });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
}


// Get all published courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate(
            "instructor");

        res.status(200).json({
            success: true,
            courses
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    createCourse,
    getAllCourses
}