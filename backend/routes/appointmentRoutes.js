// backend/routes/appointmentRoutes.js
import express from "express";
import Appointment from "../models/Appointment.js";

const router = express.Router();

// CREATE – POST /api/appointments
router.post("/", async (req, res) => {
  try {
    const {
      userEmail,
      doctorName,
      department,
      hospitalName,
      date,
      time,
      kind,
    } = req.body;

    if (
      !userEmail ||
      !doctorName ||
      !department ||
      !hospitalName ||
      !date ||
      !time
    ) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    const appt = new Appointment({
      userEmail,
      doctorName,
      department,
      hospitalName,
      date,
      time,
      kind: kind || "New",
    });

    const saved = await appt.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ – GET /api/appointments?userEmail=abc@gmail.com
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "userEmail query is required" });
    }

    const appts = await Appointment.find({ userEmail }).sort({
      createdAt: -1,
    });

    res.json(appts);
  } catch (err) {
    console.error("Get appointments error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE – DELETE /api/appointments/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Appointment not found" });
    }
    res.json({ message: "Appointment deleted", id: req.params.id });
  } catch (err) {
    console.error("Delete appointment error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;