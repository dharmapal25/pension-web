const jwt = require("jsonwebtoken");
const User = require("../models/users.model");

const LoginUser = async (req, res) => {
  try {
    const { name, email, firebaseUid, profileImage } = req.body;
    if (!email || !firebaseUid) {
      return res.status(400).json({ message: "Email and Firebase UID are required" });
    }

    // Roles are never accepted from the browser; every new account starts as student.
    const user = await User.findOneAndUpdate(
      { firebaseUid },
      {
        $set: { name: name || email.split("@")[0], email, ...(profileImage && { profileImage }) },
        $setOnInsert: { role: "student" },
      },
      { new: true, upsert: true, runValidators: true }
    );

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res
      .cookie("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 60 * 60 * 1000,
      })
      .status(200)
      .json({ message: "User logged in successfully", user });
  } catch (err) {
    res.status(500).json({ message: "Error occurred while logging in user", error: err.message });
  }
};

const GetCurrentUser = async (req, res) => {
  const user = await User.findById(req.user.id).select("-__v");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json({ user });
};

const LogoutUser = (req, res) => {
  res.clearCookie("authToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.status(200).json({ message: "User logged out successfully" });
};

module.exports = { LoginUser, LogoutUser, GetCurrentUser };
