const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["Email", "Call", "Meeting", "Note"],
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: String,
    relatedTo: {
      type: String,
      required: true,
    },
    performedBy: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);