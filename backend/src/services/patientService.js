import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { ApiError } from '../utils/ApiError.js';
import { dateRange, escapeRegex } from '../utils/helpers.js';

const POPULATE = { path: 'doctorId', select: 'name specialization hospital' };

function buildFilter(q) {
  const f = {};
  if (q.search) {
    const re = new RegExp(escapeRegex(q.search), 'i');
    f.$or = [{ name: re }, { phone: re }, { condition: re }];
  }
  if (q.condition) f.condition = q.condition;
  if (q.doctorId) f.doctorId = q.doctorId;
  const range = dateRange(q);
  if (range) f.createdAt = range;
  return f;
}

async function assertDoctor(doctorId) {
  if (!(await Doctor.exists({ _id: doctorId }))) throw new ApiError(400, 'Patient must be assigned to a valid doctor');
}

export async function listPatients(q) {
  const filter = buildFilter(q);
  const [rows, total] = await Promise.all([
    Patient.find(filter).sort({ createdAt: -1, _id: -1 }).skip((q.page - 1) * q.limit).limit(q.limit)
      .select('-__v').populate(POPULATE).lean(),
    Patient.countDocuments(filter),
  ]);
  return { rows, total };
}

export async function getPatient(id) {
  const p = await Patient.findById(id).select('-__v').populate(POPULATE).lean();
  if (!p) throw new ApiError(404, 'Patient not found');
  return p;
}

export async function createPatient(data) {
  await assertDoctor(data.doctorId);
  const p = await Patient.create(data);
  return getPatient(p.id);
}

export async function updatePatient(id, data) {
  await assertDoctor(data.doctorId);
  const p = await Patient.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean();
  if (!p) throw new ApiError(404, 'Patient not found');
  return getPatient(id);
}

export async function deletePatient(id) {
  const res = await Patient.deleteOne({ _id: id });
  if (!res.deletedCount) throw new ApiError(404, 'Patient not found');
}

export const patientMeta = async () => ({ conditions: (await Patient.distinct('condition')).sort() });
