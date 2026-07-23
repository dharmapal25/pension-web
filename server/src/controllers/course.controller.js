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

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("instructor");
        if (!course) return res.status(404).json({ success: false, message: "Course not found" });
        res.json({ success: true, course });
    } catch (error) {
        res.status(400).json({ success: false, message: "Invalid course id" });
    }
};


module.exports = {
    createCourse,
    getAllCourses,
    getCourseById
}
