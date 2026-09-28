const express = require("express");
const Activity = require("../models/Activity");
const {
  authenticate,
  authorize,
} = require("../middleware/auth");

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const activities = await Activity.find().sort({
      date: -1,
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch activities",
      error: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const activity = await Activity.create({
      ...req.body,
      performedBy: req.user.name,
    });

    res.status(201).json({
      message: "Activity created successfully",
      activity,
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to create activity",
      error: error.message,
    });
  }
});

router.delete(
  "/:id",
  authorize("Admin"),
  async (req, res) => {
    try {
      const activity =
        await Activity.findByIdAndDelete(req.params.id);

      if (!activity) {
        return res.status(404).json({
          message: "Activity not found",
        });
      }

      res.json({
        message: "Activity deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to delete activity",
        error: error.message,
      });
    }
  }
);

module.exports = router;