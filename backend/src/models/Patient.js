import mongoose from 'mongoose';

const patientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    age: { type: Number, required: true, min: 0, max: 120 },
    gender: { type: String, required: true, enum: ['Male', 'Female', 'Other'] },
    phone: { type: String, required: true, trim: true },
    condition: { type: String, required: true, trim: true, maxlength: 150 },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  },
  { timestamps: true },
);

patientSchema.index({ doctorId: 1, createdAt: -1 }); // doctor filter + patient counts + doctor detail list
patientSchema.index({ condition: 1 });
patientSchema.index({ createdAt: -1 });

export default mongoose.model('Patient', patientSchema);
