const jwt = require("jsonwebtoken");
const User = require("../models/users.model");
const { default: admin } = require("../config/adminFirebase");

// instructor auth

const instructorLoginGoogle = async () => {

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
        role: "instructor",
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
