import mongoose from 'mongoose'

const recordSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    hospitalName: { type: String, required: true },
    department: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
  },
  { timestamps: true }
)

const Record = mongoose.model('Record', recordSchema)

export default Record