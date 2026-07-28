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


const studentCourses = async (req,res) => {
    
}


module.exports = {
    studentProfile
}