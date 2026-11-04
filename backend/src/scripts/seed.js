import 'dotenv/config';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDB } from '../config/database.js';
import Doctor from '../models/Doctor.js';
import Patient from '../models/Patient.js';
import User from '../models/User.js';

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, SEED_DEMO } = process.env;
if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
  console.error('Set ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD (min 8 chars) in .env');
  process.exit(1);
}
await connectDB();
if (await User.exists({ email: ADMIN_EMAIL.toLowerCase() })) {
  console.log('Admin already exists, skipping');
} else {
  await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: await bcrypt.hash(ADMIN_PASSWORD, 12) });
  console.log(`Admin created: ${ADMIN_EMAIL}`);
}

if (SEED_DEMO === 'true' && !(await Doctor.estimatedDocumentCount())) {
  const specs = ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Dermatology'];
  const hospitals = ['Dhaka Medical', 'Square Hospital', 'Apollo Dhaka'];
  const conditions = ['Hypertension', 'Diabetes', 'Migraine', 'Fracture', 'Asthma', 'Skin allergy'];
  const monthsAgo = (m) => new Date(Date.now() - m * 30 * 86400000 - Math.random() * 20 * 86400000);
  const doctors = await Doctor.insertMany(
    Array.from({ length: 10 }, (_, i) => ({
      name: `Dr. Demo ${i + 1}`, specialization: specs[i % 5], hospital: hospitals[i % 3],
      phone: `+88017000000${String(i).padStart(2, '0')}`, email: `demo.doctor${i + 1}@example.com`, createdAt: monthsAgo(i % 6),
    })),
  );
  await Patient.insertMany(
    Array.from({ length: 60 }, (_, i) => ({
      name: `Demo Patient ${i + 1}`, age: 18 + ((i * 7) % 60), gender: ['Male', 'Female', 'Other'][i % 3],
      phone: `+88018000000${String(i).padStart(2, '0')}`, condition: conditions[i % 6],
      doctorId: doctors[(i * 3) % 10]._id, createdAt: monthsAgo(i % 6),
    })),
  );
  console.log('Demo data inserted');
}
await mongoose.disconnect();
