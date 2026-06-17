// backend/routes/labReportRoutes.js
import express from 'express'
import LabReport from '../models/LabReport.js'
import upload from '../middleware/upload.js'

const router = express.Router()

// CREATE lab report WITH optional file
// POST /api/labreports/upload  (multipart/form-data)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { userEmail, title, type, date, notes, fileName } = req.body

    if (!userEmail || !title || !type || !date) {
      return res.status(400).json({
        message: 'userEmail, title, type and date are required',
      })
    }

    let storedFileName = fileName || ''
    let filePath = ''

    if (req.file) {
      if (!storedFileName) {
        storedFileName = req.file.originalname
      }
      // app.use('/uploads', express.static(...)) exposes this path
      filePath = `/uploads/${req.file.filename}`
    }

    const report = new LabReport({
      userEmail,
      title,
      type,
      date,
      fileName: storedFileName,
      filePath,
      notes,
    })

    const saved = await report.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error('Create lab report with file error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// CREATE lab report WITHOUT file (JSON)
// POST /api/labreports
router.post('/', async (req, res) => {
  try {
    const { userEmail, title, type, date, fileName, notes } = req.body

    if (!userEmail || !title || !type || !date) {
      return res
        .status(400)
        .json({ message: 'userEmail, title, type and date are required' })
    }

    const report = new LabReport({
      userEmail,
      title,
      type,
      date,
      fileName,
      filePath: '',
      notes,
    })

    const saved = await report.save()
    res.status(201).json(saved)
  } catch (err) {
    console.error('Create lab report error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// READ – GET /api/labreports?userEmail=abc@gmail.com
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query

    if (!userEmail) {
      return res
        .status(400)
        .json({ message: 'userEmail query is required' })
    }

    const reports = await LabReport.find({ userEmail }).sort({ createdAt: -1 })
    res.json(reports)
  } catch (err) {
    console.error('Get lab reports error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

// DELETE – DELETE /api/labreports/:id
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await LabReport.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ message: 'Lab report not found' })
    }
    res.json({ message: 'Lab report deleted', id: req.params.id })
  } catch (err) {
    console.error('Delete lab report error:', err)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router