const imagekit = require('../config/imagekit');
const Course = require('../models/courses.model');
// const Course = require('../models/Course');

const uploadCourse = async (req, res) => {
    // lecture properties: title, videoUrl, duration, isPreview, resources
    // course schema properties: title, subtitle, description, instructor, category, tags, level, language, thumbnail, price, discount, lectures, totalDuration, totalLectures, rating, whatYouWillLearn

    try {
        const {
            title,
            subtitle,
            description,
            instructor,
            category,
            tags,
            level,
            language,
            price,
            discount,
            lectures,
            totalDuration,
            totalLectures,
            rating,
            whatYouWillLearn
        } = req.body;

        const file = req.file;

        if (!file) {
            return res.status(400).json({
                success: false,
                message: 'Please upload a thumbnail image file'
            });
        }

        // 2. ImageKit par buffer upload karna
        const imagekitResponse = await imagekit.upload({
            file: file.buffer, // buffer by RAM memory
            fileName: `course_thumb_${Date.now()}_${file.originalname}`,
            folder: '/course_thumbnails' // ImageKit folder name
        });

        const courseInfo = {
            title,
            subtitle,
            description,
            instructor,
            category,
            tags,
            level,
            language,
            thumbnail: imagekitResponse.url,
            price,
            discount,
            lectures,
            totalDuration,
            totalLectures,
            rating,
            whatYouWillLearn
        };

        console.log("course information : ",courseInfo);

        const newCourse = await Course.create(courseInfo);

        return res.status(201).json({
            success: true,
            message: 'Course uploaded successfully!',
            data: newCourse
        });

    } catch (error) {
        console.error("Course Upload Error:", error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server error'
        });
    }
};

module.exports = { uploadCourse };