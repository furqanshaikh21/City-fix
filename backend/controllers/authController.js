import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ✅ Helper to generate JWT Token
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    console.error("❌ JWT_SECRET is undefined! Check your .env config.");
    throw new Error("Missing JWT_SECRET in environment");
  }

  // 🧠 FIXED HERE: use `_id` instead of `id`
  return jwt.sign(
    {
      _id: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ✅ REGISTER
export const register = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists bro" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'citizen', // default
    });

    const token = generateToken(user);

    res.status(201).json({
      user: {
        _id: user._id, // make sure you use _id
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("❌ REGISTRATION ERROR:", err);
    res.status(500).json({
      message: "Registration failed bro 😭",
      error: err.message || "Unknown error",
    });
  }
};

// ✅ LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials bro' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials bro' });

    const token = generateToken(user);

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("❌ LOGIN ERROR:", err);
    res.status(500).json({ message: "Login failed bro 😓", error: err.message });
  }
};

// ✅ GET LOGGED-IN USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    console.error("❌ GET ME ERROR:", err);
    res.status(500).json({ message: "Failed to fetch user", error: err.message });
  }
};
