import mongoose from 'mongoose';

const partnershipSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    businessType: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String },
    partnershipType: { type: String, required: true }, // food, logistics, ngo, sponsor
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'approved', 'rejected', 'active', 'inactive'], 
      default: 'pending' 
    },
    notes: { type: String }, // Admin notes
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: { type: Date }
  },
  { timestamps: true }
);

const Partnership = mongoose.model('Partnership', partnershipSchema);
export default Partnership;

