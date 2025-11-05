import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

/**
 * ===============================
 * 🧩 USER SIGNUP
 * ===============================
 */
router.post("/signup", async (req, res) => {
  console.log('📝 Signup request received');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      console.log("⚠️ Missing signup fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    // Validate email format (must include .com)
    if (!email.includes('gmail.com')) {
      console.log("⚠️ Invalid email format:", email);
      return res.status(400).json({ message: "Email must include gmail.com domain" });
    }

    // Validate password length
    if (password.length < 6) {
      console.log("⚠️ Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log("⚠️ User already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    console.log("✅ User created successfully:", email);
    res.status(201).json({ message: "Signup successful! Please log in." });
  } catch (error) {
    console.error("❌ Signup error:", error.message);
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
});

/**
 * ===============================
 * 🔐 USER LOGIN
 * ===============================
 */
router.post("/login", async (req, res) => {
  try {
    console.log("🔹 Login request received:", req.body);

    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log("⚠️ Missing login fields");
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Validate email format (must include .com)
    if (!email.includes('gmail.com')) {
      console.log("⚠️ Invalid email format:", email);
      return res.status(400).json({ message: "Email must include gmail.com domain" });
    }

    // Validate password length
    if (password.length < 6) {
      console.log("⚠️ Password too short");
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log("❌ No user found for email:", email);
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("🧩 Password match:", isMatch);

    if (!isMatch) {
      console.log("❌ Invalid password");
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    console.log("✅ Login successful for:", email);

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("❌ Login error:", error.message);
    res
      .status(500)
      .json({ message: "Login failed", error: error.message });
  }
});

/**
 * ===============================
 * 👤 GET USER PROFILE (Protected)
 * ===============================
 */
router.get("/profile", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      console.log("❌ User not found for ID:", decoded.id);
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Profile fetched for:", user.email);
    res.status(200).json(user);
  } catch (error) {
    console.error("❌ Profile fetch error:", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
