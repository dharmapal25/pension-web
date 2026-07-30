const imagekit = require('../config/imagekit');
const Course = require('../models/courses.model');
const User = require('../models/users.model');

const uploadCourse = async (req, res) => {
    try {
        const {
            title,
            subtitle,
            description,
            category,
            tags,
            level,
            language,
            price,
            discount,
            lectures,
            whatYouWillLearn
        } = req.body;

        // Get instructor id from logged in user (not from body, for security)
        const instructor = req.user?.id;
        if (!instructor) {
            return res.status(401).json({
                success: false, message: 'Unauthorized'
            });
        }

        // Check thumbnail file
        const file = req.file;
        if (!file) {
            return res.status(400).json({ success: false, message: 'Thumbnail image is required' });
        }

        const parsedLectures = JSON.parse(lectures || '[]');
        const parsedTags = JSON.parse(tags || '[]');
        const parsedWhatYouWillLearn = JSON.parse(whatYouWillLearn || '[]');

        if (parsedLectures.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one lecture is required' });
        }

        // Convert lecture duration to Number (form-data always sends strings)
        const lecturesData = parsedLectures.map((lec) => ({
            title: lec.title,
            videoUrl: lec.videoUrl,
            duration: Number(lec.duration),
            isPreview: Boolean(lec.isPreview),
            resources: lec.resources || []
        }));

        // Calculate total duration and total lectures 
        let totalDuration = 0;
        for (const lec of lecturesData) {
            totalDuration += lec.duration;
        }
        const totalLectures = lecturesData.length;

        // Upload thumbnail to ImageKit
        const imagekitResponse = await imagekit.upload({
            file: file.buffer,
            fileName: `course_thumb_${Date.now()}_${file.originalname}`,
            folder: '/course_thumbnails'
        });

        // Build final course data
        const courseInfo = {
            title,
            subtitle,
            description,
            instructor,
            category,
            tags: parsedTags,
            level,
            language,
            thumbnail: imagekitResponse.url,
            price: Number(price) || 0,
            discount: Number(discount) || 0,
            lectures: lecturesData,
            totalDuration,
            totalLectures,
            whatYouWillLearn: parsedWhatYouWillLearn
        };

        const newCourse = await Course.create(courseInfo);

        await User.findByIdAndUpdate(
            instructor,
            {
                $addToSet: {
                    createdCourses: newCourse._id,
                },
            },
            { new: true }
        );

        return res.status(201).json({
            success: true,
            message: 'Course uploaded successfully!',
            data: newCourse
        });

    } catch (error) {
        console.error("Course Upload Error:", error);

        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message });
        }

        return res.status(500).json({
            success: false, message: error.message || 'Server error'
        });
    }
};

const viewCourse = async (req, res) => {
    try {
        console.log(req.user)

        const instructorId = req.user?.id;
        if (!instructorId) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }


        // const instructorCourses = await Course.find({ instructor: instructorId })
        // // .populate("boughtCourses");
        const instructorCourses = await User.find({ instructor: instructorId })
        // // .populate("boughtCourses");

        if (!instructorCourses) {
            return res.status(404).json({
                success: false,
                message: "Instructor not found",
            });
        }

        return res.status(200).json({
            success: true,
            totalCourses: instructorCourses.courses?.length,
            courses: instructorCourses,
        });

    } catch (error) {
        console.error("View Course Error:", error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
};

module.exports = { uploadCourse, viewCourse };