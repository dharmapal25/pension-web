const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },

    firebaseUid: {
      type: String,
      required: [true, "Firebase UID is required"],
      unique: true,
    },

    profileImage: {
      type: String,
      default: "https://i.pinimg.com/474x/13/74/20/137420f5b9c39bc911e472f5d20f053e.jpg?nii=t",
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    isInstructor: {
      type: Boolean,
      default: false,  // student → instructor "upgrade" instructor = true 
    },

    // Student-specific
    boughtCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],

    // Instructor-specific
    createdCourses: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
