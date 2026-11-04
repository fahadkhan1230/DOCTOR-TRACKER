import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

// Compared against when the user doesn't exist, so response time doesn't reveal valid emails.
const DUMMY_HASH = bcrypt.hashSync('dummy-password', 12);

export async function login(email, password) {
  const user = await User.findOne({ email }).select('+password');
  const ok = await bcrypt.compare(password, user?.password ?? DUMMY_HASH);
  if (!user || !ok) throw new ApiError(401, 'Invalid login credentials');
  const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '1d' });
  return { token, user: { id: user.id, name: user.name, email: user.email } };
}

export async function getProfile(id) {
  const user = await User.findById(id).select('name email createdAt').lean();
  if (!user) throw new ApiError(401, 'Account no longer exists');
  return { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt };
}
