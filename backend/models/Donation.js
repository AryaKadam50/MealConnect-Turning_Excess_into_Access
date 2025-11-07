import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true },
    donorEmail: { type: String, required: true },
    donorPhone: { type: String, required: true },
    panCard: { type: String },
    amount: { type: Number, required: true, min: 1 },
    paymentMethod: { 
      type: String, 
      enum: ['upi', 'card', 'bank', 'cash'], 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      enum: ['pending', 'completed', 'failed', 'refunded'], 
      default: 'pending' 
    },
    transactionId: { type: String },
    notes: { type: String },
    status: { 
      type: String, 
      enum: ['active', 'cancelled', 'refunded'], 
      default: 'active' 
    }
  },
  { timestamps: true }
);

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;

