const mongoose = require("mongoose");

// lectureSchema

const lectureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Lecture title is required"],
      trim: true,
      maxlength: 150,
    },

    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
      trim: true,
    },

    duration: {
      type: Number,
      required: [true, "Lecture duration is required"],
      min: [1, "Duration must be greater than 0"],
    },

    isPreview: {
      type: Boolean,
      default: false,
    },

    resources: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    _id: true,
  }
);


  //  Course Schema


const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Course title is required"],
      trim: true,
      maxlength: 120,
    },

    subtitle: {
      type: String,
      required: [true, "Course subtitle is required"],
      trim: true,
      unique: true,
      maxlength: 200,
    },

    description: {
      type: String,
      required: [true, "Course description is required"],
      trim: true,
    },

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Instructor is required"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Web Development",
        "Data Science",
        "Programming",
        "Design",
        "Business",
        "Marketing",
        "App Development",
      ],
      trim: true,
    },

    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
      trim: true,
    },

    language: {
      type: String,
      enum: ["English", "Hindi", "Spanish", "French", "German"],
      default: "English",
      trim: true,
    },

    thumbnail: {
      type: String,
      required: [true, "Thumbnail is required"],
      trim: true,
    },

    price: {
      type: Number,
      default: 0,
      min: 0,
    },

    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    lectures: [lectureSchema],

    totalDuration: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalLectures: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },

      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    whatYouWillLearn: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;