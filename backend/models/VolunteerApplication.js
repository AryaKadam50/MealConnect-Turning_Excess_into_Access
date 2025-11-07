import mongoose from 'mongoose';

const volunteerApplicationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    availability: { type: String, required: true },
    verificationProofUrl: { type: String },
    status: { type: String, enum: ['submitted', 'verified', 'rejected'], default: 'submitted' }
  },
  { timestamps: true }
);

const VolunteerApplication = mongoose.model('VolunteerApplication', volunteerApplicationSchema);
export default VolunteerApplication;


