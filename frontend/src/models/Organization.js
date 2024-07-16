import mongoose from 'mongoose';

const OrganizationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  contact: { type: String, required: true },
  actors: [
    {
      role: { type: String, enum: ['Manufacturer', 'Distributor', 'Retailer'], required: true },
      email: { type: String, required: true },
      password: { type: String, required: true },
    },
  ],
});

export default mongoose.models.Organization || mongoose.model('Organization', OrganizationSchema);
