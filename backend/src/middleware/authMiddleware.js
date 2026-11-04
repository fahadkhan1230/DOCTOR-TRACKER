import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

export const COOKIE_NAME = 'dt_token';

export function protect(req, _res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return next(new ApiError(401, 'Authentication required'));
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    next(new ApiError(401, 'Session expired. Please log in again'));
  }
}
