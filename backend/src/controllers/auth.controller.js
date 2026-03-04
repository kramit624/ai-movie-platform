const User = require("../models/user.model");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Generate access and refresh tokens
const generateTokens = async (userId) => {
  const user = await User.findById(userId);

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  // Hash refresh token before saving
  const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);

  user.refreshToken = hashedRefreshToken;
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
};

// register a new user

const registerUser = asyncHandler(async (req, res) => {
  const { fullName, username, email, password } = req.body;

  // Validate required fields
  if (!fullName || !username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }


  // if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      message: "User with email or username already exists",
    });
  }

  // Create user
  const user = await User.create({
    fullName,
    username,
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  return res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: createdUser,
  });
});


// login user

const loginUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  // Require password + either email or username
  if (!password || (!email && !username)) {
    return res.status(400).json({
      success: false,
      message: "Email or Username and password are required",
    });
  }

  // Find user
  const user = await User.findOne({
    $or: [{ email }, { username }],
  }).select("+password");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Compare password
  const isPasswordValid = await user.isPasswordCorrect(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }

  // Generate tokens
  const { accessToken, refreshToken } = await generateTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken",
  );

  // Cookies options
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json({
      success: true,
      message: "User logged in successfully",
      data:{
        user: loggedInUser,
        accessToken,
        refreshToken,
      }
    });
});


module.exports = {
  registerUser,
  loginUser,
};