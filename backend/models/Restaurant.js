import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    contact: { type: String },
    image: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Link to User account
  },
  { timestamps: true }
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;


