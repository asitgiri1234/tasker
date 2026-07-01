const jwt = require("jsonwebtoken");
const User = require("../models/User");

const signToken = (user) =>
  jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const validationErrors = (err) => ({
  message: "Validation failed",
  errors: Object.values(err.errors).map((e) => e.message),
});

/**
 * @route   POST /api/auth/register
 * @desc    Create an account and return a JWT
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email: (email || "").toLowerCase() });
    if (exists) {
      return res.status(409).json({ message: "That email is already registered" });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user);
    res.status(201).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json(validationErrors(err));
    }
    // Duplicate key (unique email) safety net for race conditions.
    if (err.code === 11000) {
      return res.status(409).json({ message: "That email is already registered" });
    }
    next(err);
  }
};

/**
 * @route   POST /api/auth/login
 * @desc    Verify credentials and return a JWT
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    // password has select:false, so ask for it explicitly.
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password"
    );
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Incorrect email or password" });
    }

    const token = signToken(user);
    res.status(200).json({ token, user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

/**
 * @route   GET /api/auth/me
 * @desc    Return the current user (validates the token)
 */
const me = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ user: user.toSafeJSON() });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, me };
