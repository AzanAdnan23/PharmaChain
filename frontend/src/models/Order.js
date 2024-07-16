import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  product: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['Being Manufactured', 'Being Delivered', 'Delivered'], required: true },
  rfidTag: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  organization: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization', required: true },
});

export default mongoose.models.Order || mongoose.model('Order', OrderSchema);
