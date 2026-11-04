import { Router } from 'express';
import * as c from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const r = Router();
r.use(protect);
r.get('/stats', c.stats);
r.get('/patients-per-doctor', c.perDoctor);
r.get('/monthly-stats', c.monthly);
r.get('/specialization-stats', c.specializations);
export default r;
