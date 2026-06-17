import mongoose from 'mongoose'

const appointmentSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    doctorName: { type: String, required: true },
    department: { type: String, required: true },
    hospitalName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    kind: { type: String, default: 'New' },
  },
  { timestamps: true }
)

const Appointment = mongoose.model('Appointment', appointmentSchema)

export default Appointment