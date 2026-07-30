const User = require("../models/users.model");

const studentProfile = async (req, res) => {
    const { id } = req.body;

    try {
        const student = await User.findById(id);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            success: true,
            student
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};


const studentCourses = async (req, res) => {

    try {
        const studentId = req.user?.id;

        if (!studentId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        const studentCourse = await User.findById( studentId )
            .populate("boughtCourses");


        return res.status(200).json({
            success: true,
            studentId,
            Course : studentCourse
        });

    } catch (error) {
        console.error("View Course Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
}


module.exports = {
    studentProfile,
    studentCourses
}