import User from "../models/User.js";
import jwt from "jsonwebtoken";

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register user (supports role assignment)
export const registerUser = async (req, res) => {
  const { name, email, password, role,adminSecret } = req.body; // role can be 'user' or 'admin'

  let userRole = "user";
  if (role === "admin") {
    if (adminSecret !== process.env.ADMIN_SECRET) {
      return res.status(403).json({ message: "Invalid admin secret" });
    }
    userRole = "admin";
  }
  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user.id),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,       // include role in login response
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const makeAdmin = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "admin";
    await user.save();

    res.json({ success: true, message: `${user.name} is now an admin`, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to make user admin" });
  }
};

// Get user profile
export const getProfile = async (req, res) => {
  res.json(req.user);
};
