import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
    name: { type: String, required: true },
    quantity: { type: String, required: true },
    category: { type: String, required: true },
    expiryTime: { type: String, required: true },
    image: { type: String, default: '' },
    status: { type: String, enum: ['available', 'picked', 'expired'], default: 'available' }
  },
  { timestamps: true }
);

const MenuItem = mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;


