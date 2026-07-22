const Mongoose = require("mongoose");

// lecture sub-document schema

// properties 
// title, videoUrl, duration, isPreview, resources

const lectureSchema = new Mongoose.Schema({

  title: {
    type: String,
    required: [true, "Lecture title is required"]
  },

  videoUrl: {
    type: String,
    required: [true, "Video URL is required"]
  },

  duration: {
    type: Number,
    required: [true, "Duration is required"]
  },

  isPreview: {
    type: Boolean,
    default: false
  }, // free preview lecture

  resources: [{ type: String }], // PDF/notes links

});


// course schema
// properties
// title, subtitle, description, instructor, category, tags, level, language, thumbnail, price, discount, lectures, totalDuration, totalLectures, rating, whatYouWillLearn

const courseSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    trim: true
  },

  subtitle: {
    type: String,
    required: [true, "Course subtitle is required"],
    unique: true
  }, // "Master Python by building 100 projects"

  description: {
    type: String,
    required: [true, "Course description is required"]
  },

  instructor: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Instructor is required"],
  },

  category: {
    type: String,
    enum: ["Web Development", "Data Science", "Programming", "Design", "Business", "Marketing", "App Development"],
    required: [true, "Category is required"]
  },

  tags: [{ type: String }], // "Python", "Data Science", "Flask"

  level: {
    type: String,
    enum: ["beginner", "intermediate", "advanced"],
    default: "beginner",
  },

  language: {
    type: String,
    enum: ["English", "Hindi", "Spanish", "French", "German"],
    default: "English"
  },

  thumbnail: {
    type: String,
    required: [true, "Thumbnail is required"]
  },

  price: {
    type: Number,
    default: 0
  },

  discount: {
    type: Number,
    default: 0
  },

  lectures: [lectureSchema], // embedded sub-documents

  totalDuration: { type: Number, default: 0 }, // lectures of sum
  totalLectures: { type: Number, default: 0 }, // count

  rating: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },

  whatYouWillLearn: [{ type: String }], // bullet points
},

  { timestamps: true }
);

const Course = Mongoose.model("Course", courseSchema);
module.exports = Course



