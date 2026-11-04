import * as svc from '../services/patientService.js';
import { asyncHandler, sendOk, sendPage } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const q = req.valid.query;
  const { rows, total } = await svc.listPatients(q);
  sendPage(res, rows, q, total);
});
export const meta = asyncHandler(async (_req, res) => sendOk(res, await svc.patientMeta()));
export const get = asyncHandler(async (req, res) => sendOk(res, await svc.getPatient(req.params.id)));
export const create = asyncHandler(async (req, res) => sendOk(res, await svc.createPatient(req.valid.body), 201));
export const update = asyncHandler(async (req, res) => sendOk(res, await svc.updatePatient(req.params.id, req.valid.body)));
export const remove = asyncHandler(async (req, res) => {
  await svc.deletePatient(req.params.id);
  sendOk(res, { message: 'Patient deleted' });
});
