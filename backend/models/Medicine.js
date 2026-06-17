import mongoose from 'mongoose'

const medicineSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    schedule: { type: String, required: true },
    status: { type: String, default: 'Pending' },
  },
  { timestamps: true }
)

const Medicine = mongoose.model('Medicine', medicineSchema)

export default Medicine