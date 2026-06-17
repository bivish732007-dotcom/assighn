import mongoose from 'mongoose'

const labReportSchema = new mongoose.Schema(
  {
    userEmail: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true },
    date: { type: String, required: true },
    fileName: { type: String },
    filePath: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
)

const LabReport = mongoose.model('LabReport', labReportSchema)

export default LabReport