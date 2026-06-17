// backend/routes/medicineRoutes.js
import express from "express";
import Medicine from "../models/Medicine.js";

const router = express.Router();

// CREATE – POST /api/medicines
router.post("/", async (req, res) => {
  try {
    const { userEmail, name, dosage, schedule, status } = req.body;

    if (!userEmail || !name || !dosage || !schedule) {
      return res
        .status(400)
        .json({ message: "userEmail, name, dosage, schedule are required" });
    }

    const med = new Medicine({
      userEmail,
      name,
      dosage,
      schedule,
      status: status || "Pending",
    });

    const saved = await med.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Create medicine error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// READ – GET /api/medicines?userEmail=abc@gmail.com
router.get("/", async (req, res) => {
  try {
    const { userEmail } = req.query;

    if (!userEmail) {
      return res.status(400).json({ message: "userEmail query is required" });
    }

    const meds = await Medicine.find({ userEmail }).sort({ createdAt: -1 });
    res.json(meds);
  } catch (err) {
    console.error("Get medicines error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// UPDATE status – PATCH /api/medicines/:id/toggle
router.patch("/:id/toggle", async (req, res) => {
  try {
    const med = await Medicine.findById(req.params.id);
    if (!med) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    med.status = med.status === "Pending" ? "Taken" : "Pending";
    const updated = await med.save();

    res.json(updated);
  } catch (err) {
    console.error("Toggle medicine error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE – DELETE /api/medicines/:id
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Medicine.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Medicine not found" });
    }
    res.json({ message: "Medicine deleted", id: req.params.id });
  } catch (err) {
    console.error("Delete medicine error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;