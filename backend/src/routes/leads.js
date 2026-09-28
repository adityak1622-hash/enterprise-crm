const express = require("express");
const Lead = require("../models/Lead");
const { authenticate, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch leads",
      error: error.message,
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch lead",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const lead = await Lead.create(req.body);

    res.status(201).json({
      message: "Lead created successfully",
      lead,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create lead",
      error: error.message,
    });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json({
      message: "Lead updated successfully",
      lead,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update lead",
      error: error.message,
    });
  }
});

router.delete("/:id", authorize("Admin"), async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    res.json({
      message: "Lead deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete lead",
      error: error.message,
    });
  }
});

module.exports = router;
