import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { User } from '../models/User.js';

export const auth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.uid).select('_id name email');
    if (!user) return res.status(401).json({ message: 'Invalid token user' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};
