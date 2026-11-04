import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import { ApiError } from '../utils/ApiError.js';
import { dateRange, escapeRegex } from '../utils/helpers.js';

function buildFilter(q) {
  const f = {};
  if (q.search) {
    const re = new RegExp(escapeRegex(q.search), 'i');
    f.$or = [{ name: re }, { specialization: re }, { hospital: re }, { email: re }];
  }
  if (q.specialization) f.specialization = q.specialization;
  if (q.hospital) f.hospital = q.hospital;
  const range = dateRange(q);
  if (range) f.createdAt = range;
  return f;
}

/** One aggregation: filter -> sort -> paginate -> count patients only for the page's doctors (no N+1). */
export async function listDoctors(q) {
  const [res] = await Doctor.aggregate([
    { $match: buildFilter(q) },
    {
      $facet: {
        data: [
          { $sort: { createdAt: -1, _id: -1 } },
          { $skip: (q.page - 1) * q.limit },
          { $limit: q.limit },
          { $lookup: { from: 'patients', localField: '_id', foreignField: 'doctorId', pipeline: [{ $count: 'n' }], as: 'pc' } },
          { $addFields: { patientCount: { $ifNull: [{ $first: '$pc.n' }, 0] } } },
          { $project: { pc: 0, __v: 0 } },
        ],
        total: [{ $count: 'n' }],
      },
    },
  ]);
  return { rows: res.data, total: res.total[0]?.n ?? 0 };
}

export async function getDoctor(id) {
  const doctor = await Doctor.findById(id).select('-__v').lean();
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  doctor.patientCount = await Patient.countDocuments({ doctorId: id });
  return doctor;
}

export const createDoctor = (data) => Doctor.create(data);

export async function updateDoctor(id, data) {
  const doctor = await Doctor.findByIdAndUpdate(id, data, { new: true, runValidators: true }).select('-__v').lean();
  if (!doctor) throw new ApiError(404, 'Doctor not found');
  return doctor;
}

/**
 * Safe deletion: a doctor with patients cannot be deleted unless the caller names another
 * doctor (reassignTo) to take them over. Patients are never orphaned and never silently deleted.
 */
export async function deleteDoctor(id, reassignTo) {
  if (!(await Doctor.exists({ _id: id }))) throw new ApiError(404, 'Doctor not found');
  const count = await Patient.countDocuments({ doctorId: id });
  if (count > 0) {
    if (!reassignTo) throw new ApiError(409, `This doctor has ${count} patient(s). Reassign them to another doctor before deleting.`);
    if (reassignTo === id) throw new ApiError(400, 'Cannot reassign patients to the doctor being deleted');
    if (!(await Doctor.exists({ _id: reassignTo }))) throw new ApiError(400, 'Target doctor not found');
    await Patient.updateMany({ doctorId: id }, { doctorId: reassignTo });
  }
  await Doctor.deleteOne({ _id: id });
  return { reassigned: count };
}

export async function listDoctorPatients(id, { page, limit }) {
  if (!(await Doctor.exists({ _id: id }))) throw new ApiError(404, 'Doctor not found');
  const [rows, total] = await Promise.all([
    Patient.find({ doctorId: id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).select('-__v').lean(),
    Patient.countDocuments({ doctorId: id }),
  ]);
  return { rows, total };
}

/** Distinct values + lightweight doctor list for filter and form dropdowns. */
export async function doctorMeta() {
  const [specializations, hospitals, doctors] = await Promise.all([
    Doctor.distinct('specialization'),
    Doctor.distinct('hospital'),
    Doctor.find().sort({ name: 1 }).limit(500).select('name specialization').lean(),
  ]);
  return { specializations: specializations.sort(), hospitals: hospitals.sort(), doctors };
}
