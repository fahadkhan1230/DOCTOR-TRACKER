import * as svc from '../services/doctorService.js';
import { asyncHandler, sendOk, sendPage } from '../utils/helpers.js';

export const list = asyncHandler(async (req, res) => {
  const q = req.valid.query;
  const { rows, total } = await svc.listDoctors(q);
  sendPage(res, rows, q, total);
});
export const meta = asyncHandler(async (_req, res) => sendOk(res, await svc.doctorMeta()));
export const get = asyncHandler(async (req, res) => sendOk(res, await svc.getDoctor(req.params.id)));
export const create = asyncHandler(async (req, res) => sendOk(res, await svc.createDoctor(req.valid.body), 201));
export const update = asyncHandler(async (req, res) => sendOk(res, await svc.updateDoctor(req.params.id, req.valid.body)));
export const remove = asyncHandler(async (req, res) =>
  sendOk(res, await svc.deleteDoctor(req.params.id, req.valid.query.reassignTo)));
export const patients = asyncHandler(async (req, res) => {
  const q = req.valid.query;
  const { rows, total } = await svc.listDoctorPatients(req.params.id, q);
  sendPage(res, rows, q, total);
});
