import * as auth from '../services/authService.js';
import { COOKIE_NAME } from '../middleware/authMiddleware.js';
import { asyncHandler, sendOk } from '../utils/helpers.js';

const cookieOpts = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.COOKIE_SAMESITE || 'lax',
  path: '/',
});

export const login = asyncHandler(async (req, res) => {
  const { token, user } = await auth.login(req.valid.body.email, req.valid.body.password);
  res.cookie(COOKIE_NAME, token, { ...cookieOpts(), maxAge: 24 * 60 * 60 * 1000 });
  sendOk(res, user);
});

export const logout = (_req, res) => {
  res.clearCookie(COOKIE_NAME, cookieOpts());
  sendOk(res, { message: 'Logged out' });
};

export const me = asyncHandler(async (req, res) => sendOk(res, await auth.getProfile(req.userId)));
