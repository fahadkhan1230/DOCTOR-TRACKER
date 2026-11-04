import { Router } from 'express';
import * as c from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validate, validateId } from '../middleware/validateMiddleware.js';
import { deleteDoctorQuery, doctorListQuery, doctorSchema } from '../validators/doctorValidator.js';
import { doctorPatientsQuery } from '../validators/patientValidator.js';

const r = Router();
r.use(protect);
r.get('/meta', c.meta); // must stay above /:id
r.route('/').get(validate(doctorListQuery, 'query'), c.list).post(validate(doctorSchema), c.create);
r.get('/:id/patients', validateId(), validate(doctorPatientsQuery, 'query'), c.patients);
r.route('/:id')
  .get(validateId(), c.get)
  .put(validateId(), validate(doctorSchema), c.update)
  .delete(validateId(), validate(deleteDoctorQuery, 'query'), c.remove);
export default r;
