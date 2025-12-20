const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to create a JWT
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "3h",
  });
};

// ======================= REGISTER =======================
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      error: "Username, email, and password are required.",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: "Email already in use. Please log in.",
      });
    }

    // Store password as plain text (no hashing)
    const user = await User.create({ username, email, password });

    const token = createToken(user._id);

    res.status(201).json({
      success: true,
      message: "User registered successfully.",
      data: {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName || user.username
        }
      },
    });
  } catch (err) {
    console.error("⚠️ Registration error:", err);
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error.",
    });
  }
};

// ======================= LOGIN =======================
exports.login = async (req, res) => {
  const { username, password } = req.body;

  console.log("🔍 Login Attempt:", { username, password }); // DEBUG LOG

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      error: "Username and password are required.",
    });
  }

  try {
    // Case-insensitive search using regex for BOTH username and email
    const user = await User.findOne({
      $or: [
        { username: { $regex: new RegExp(`^${username}$`, 'i') } },
        { email: { $regex: new RegExp(`^${username}$`, 'i') } }
      ]
    });
    console.log("👤 User found in DB:", user); // DEBUG LOG

    if (!user) {
      return res.status(401).json({
        success: false,
        error: "User not found.",
      });
    }

    // Direct plain-text comparison
    if (password !== user.password) {
      return res.status(401).json({
        success: false,
        error: "Incorrect password.",
      });
    }

    const token = createToken(user._id);

    res.status(200).json({
      success: true,
      message: "Login successful.",
      data: {
        token,
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName || user.username
        }
      },
    });
  } catch (err) {
    console.error("⚠️ Login error:", err);
    res.status(500).json({
      success: false,
      error:
        process.env.NODE_ENV === "development"
          ? err.message
          : "Internal server error.",
    });
  }
};
