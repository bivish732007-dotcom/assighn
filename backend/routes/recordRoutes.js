// backend/routes/recordRoutes.js
import express from "express";
import Record from "../models/Record.js";

const router = express.Router();

// CREATE – POST /api/records
router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      patientName,
      doctorName,
      hospitalName,
      department,
      description,
      date,
    } = req.body;

    if (
      !userEmail ||
      !patientName ||
      !doctorName ||
      !hospitalName ||
      !department ||
      !description ||
      !date
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const rec = new Record({
      userEmail,
      patientName,
      doctorName,
      hospitalName,
      department,
      description,
      date,
    });

    const saved = await rec.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create record error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ – GET /api/records?userEmail=abc@gmail.com
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "userEmail query is required" });
    }

    const records = await Record.find({ userEmail }).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    console.error("Get records error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE – DELETE /api/records/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Record.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.json({ message: "Record deleted", id: req.params.id });
  } catch (err) {
    console.error("Delete record error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;