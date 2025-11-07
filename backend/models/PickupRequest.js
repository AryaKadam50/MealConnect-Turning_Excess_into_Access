import mongoose from 'mongoose';

const pickupRequestSchema = new mongoose.Schema(
  {
    items: [
      {
        menuItem: { type: mongoose.Schema.Types.ObjectId, ref: 'MenuItem', required: true },
        restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
        restaurantName: String,
        restaurantLocation: String,
        quantity: { type: Number, required: true, default: 1 },
        itemName: String,
        itemPrice: Number
      }
    ],
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    requesterName: String,
    requesterEmail: String,
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentMethod: String,
    totalAmount: Number,
    status: { type: String, enum: ['pending', 'accepted', 'rejected', 'completed', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
);

const PickupRequest = mongoose.model('PickupRequest', pickupRequestSchema);
export default PickupRequest;


