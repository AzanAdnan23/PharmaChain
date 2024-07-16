import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Manufacturer', 'Distributor', 'Retailer'], required: true },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
