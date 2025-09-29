import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { config } from '../config/env.js';

const signupSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

const cookieOpts = {
  httpOnly: true,
  secure: config.cookieSecure,
  sameSite: "lax",
  // domain: config.cookieDomain,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  path: "/",
};

export const signup = async (req, res) => {
  const parsed = signupSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid input" });

  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(409).json({ message: "Email already registered" });

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash });

  const token = jwt.sign({ uid: user._id }, config.jwtSecret, {
    expiresIn: "7d",
  });
  res.cookie("token", token, cookieOpts);
  res
    .status(201)
    .json({ user: { id: user._id, name: user.name, email: user.email } });
};

export const login = async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success)
    return res.status(400).json({ message: "Invalid input" });

  const { email, password } = parsed.data;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ uid: user._id }, config.jwtSecret, {
    expiresIn: "7d",
  });
  if (config.nodeEnv === "production" && config.cookieDomain) {
    cookieOptions.domain = config.cookieDomain;
  }
  res.cookie("token", token, cookieOpts);
  res.json({ user: { id: user._id, name: user.name, email: user.email } });
};

export const me = async (req, res) => {
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } });
};

export const logout = async (req, res) => {
  res.clearCookie('token', { ...cookieOpts});
  res.json({ message: 'Logged out' });
};
