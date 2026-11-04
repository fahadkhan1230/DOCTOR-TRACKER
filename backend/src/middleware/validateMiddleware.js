import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';

/** validate(schema, 'body' | 'query') -> parsed result stored on req.valid[source] */
export const validate = (schema, source = 'body') => (req, _res, next) => {
  try {
    req.valid = { ...req.valid, [source]: schema.parse(req[source]) };
    next();
  } catch (e) {
    next(e);
  }
};

export const validateId = (param = 'id') => (req, _res, next) =>
  mongoose.isValidObjectId(req.params[param]) ? next() : next(new ApiError(400, 'Invalid ID'));
