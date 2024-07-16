import mongoose from 'mongoose';

const RfidTagSchema = new mongoose.Schema({
  tagId: { type: String, required: true, unique: true },
  order: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  scannedAt: { type: Date, default: Date.now },
  location: { type: String, required: true },
});

export default mongoose.models.RfidTag || mongoose.model('RfidTag', RfidTagSchema);
