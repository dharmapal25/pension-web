const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const auth = require("../config/adminFirebase");

const instructorLoginGoogle = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: "Firebase idToken is required",
      });
    }

    // Verify Firebase Token
    const decodedToken = await auth.verifyIdToken(idToken);

    const {
      uid,
      email,
      name,
      picture,
    } = decodedToken;

    // Find existing user
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      // Create new instructor
      user = await User.create({
        name,
        email,
        firebaseUid: uid,
        profileImage: picture,
        role: "instructor",
        isInstructor: true,
      });
    } else {
      // Update existing user if needed
      user.name = name || user.name;
      user.profileImage = picture || user.profileImage;
      user.role = "instructor";
      user.isInstructor = true;

      await user.save();
    }

    // JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Instructor login successful",
      user: {
        id: user._id,
        user
      },
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Error occurred while logging in instructor",
      error: err.message,
    });
  }
};


const instructorLogoutGoogle = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.json({
    success: true,
    message: "Logout Successfully",
  });


}

const instructorsAll = async (req, res) => {

  const users = await User.find({ role: "instructor" });

  res.status(200).json({
    allInstructor: users
  })
}


// Student auth

const studentLoginGoogle = async () => {

  try {

    // const { name, email, firebaseUid, profileImage, role, isInstructor, boughtCourses } = req.body
    const { idToken, role } = req.body;

    if (!idToken) {
      return res.status(400).json({
        message: "Firebase token are required"
      });
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { uid, email, name, picture } = decodedToken;


    const user = await User.findOne({ email });

    if (!user) {
      user = await User.create({
        email,
        name,
        firebaseUid: uid,
        avatar: picture,
        role: "student",
      });
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role
    },
      process.env.JWT_SECRET,

      { expiresIn: "7d" }
    );

    res.json({ token }).cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });


  } catch (err) {
    res.status(500).json({
      message: "Error occurred while logging in user",
      error: err.message
    });
  }
}

const studentLogoutGoogle = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
  });

  res.json({
    success: true,
    message: "Logout Successfully",
  });


}

const studentsAll = async (req, res) => {

  const users = await User.find({ role: "student" });

  res.status(200).json({
    allStudent: users
  })
}

module.exports = {
  instructorLoginGoogle,
  instructorLogoutGoogle,
  instructorsAll,

  studentLoginGoogle,
  studentLogoutGoogle,
  studentsAll
};
