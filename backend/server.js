// backend/server.js
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'

// Routes
import authRoutes from './routes/authRoutes.js'
import patientRoutes from './routes/patientRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import recordRoutes from './routes/recordRoutes.js'
import medicineRoutes from './routes/medicineRoutes.js'
import labReportRoutes from './routes/labReportRoutes.js'

dotenv.config()

// __dirname (ES modules)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// API routes
app.use('/api/auth', authRoutes)
app.use('/api/patient', patientRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/records', recordRoutes)
app.use('/api/medicines', medicineRoutes)
app.use('/api/labreports', labReportRoutes)

// MongoDB connect using env
const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/healthsync'

mongoose
  .connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Mongo connection error:', err))

// Default route
app.get('/', (req, res) => {
  res.send('API running')
})

// Server start
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})