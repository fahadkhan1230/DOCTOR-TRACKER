import { Router } from 'express';
import * as c from '../controllers/patientController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, validateId } from '../middleware/validateMiddleware.js';
import { patientListQuery, patientSchema } from '../validators/patientValidator.js';

const r = Router();
r.use(protect);
r.get('/meta', c.meta);
r.route('/').get(validate(patientListQuery, 'query'), c.list).post(validate(patientSchema), c.create);
r.route('/:id')
  .get(validateId(), c.get)
  .put(validateId(), validate(patientSchema), c.update)
  .delete(validateId(), c.remove);
export default r;
