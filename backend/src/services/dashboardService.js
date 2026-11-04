import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';

const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

export async function getStats() {
  const since = daysAgo(30);
  const [totalDoctors, totalPatients, newDoctors, newPatients, recentDoctors, recentPatients, avg] = await Promise.all([
    Doctor.estimatedDocumentCount(),
    Patient.estimatedDocumentCount(),
    Doctor.countDocuments({ createdAt: { $gte: since } }),
    Patient.countDocuments({ createdAt: { $gte: since } }),
    Doctor.find().sort({ createdAt: -1 }).limit(5).select('name specialization hospital createdAt').lean(),
    Patient.find().sort({ createdAt: -1 }).limit(5).select('name condition doctorId createdAt').populate('doctorId', 'name').lean(),
    Patient.aggregate([{ $group: { _id: null, avgAge: { $avg: '$age' } } }]),
  ]);
  return {
    totalDoctors, totalPatients, newDoctors, newPatients,
    avgPatientAge: avg[0] ? Math.round(avg[0].avgAge) : 0,
    avgPatientsPerDoctor: totalDoctors ? +(totalPatients / totalDoctors).toFixed(1) : 0,
    recentDoctors, recentPatients,
  };
}

export const patientsPerDoctor = () =>
  Patient.aggregate([
    { $group: { _id: '$doctorId', patients: { $sum: 1 } } },
    { $sort: { patients: -1 } },
    { $limit: 10 },
    { $lookup: { from: 'doctors', localField: '_id', foreignField: '_id', pipeline: [{ $project: { name: 1 } }], as: 'd' } },
    { $project: { _id: 0, doctorId: '$_id', name: { $ifNull: [{ $first: '$d.name' }, 'Unknown'] }, patients: 1 } },
  ]);

/** Last 6 calendar months, gaps filled with 0 so the chart line is continuous. */
export async function monthlyStats() {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 5, 1));
  const group = (Model) =>
    Model.aggregate([
      { $match: { createdAt: { $gte: start } } },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, n: { $sum: 1 } } },
    ]);
  const [p, d] = await Promise.all([group(Patient), group(Doctor)]);
  const pm = new Map(p.map((x) => [x._id, x.n]));
  const dm = new Map(d.map((x) => [x._id, x.n]));
  return Array.from({ length: 6 }, (_, i) => {
    const dt = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1));
    const key = dt.toISOString().slice(0, 7);
    return { month: dt.toLocaleString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' }), patients: pm.get(key) ?? 0, doctors: dm.get(key) ?? 0 };
  });
}

export const specializationStats = () =>
  Doctor.aggregate([
    { $group: { _id: '$specialization', value: { $sum: 1 } } },
    { $sort: { value: -1 } },
    { $project: { _id: 0, name: '$_id', value: 1 } },
  ]);
