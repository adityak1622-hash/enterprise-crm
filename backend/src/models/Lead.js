const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
    },

    company: {
      type: String,
    },

    source: {
      type: String,
      enum: ["Website", "Referral", "LinkedIn", "Advertisement", "Other"],
      default: "Other",
    },

    stage: {
      type: String,
      enum: [
        "New",
        "Contacted",
        "Qualified",
        "Proposal",
        "Negotiation",
        "Won",
        "Lost",
      ],
      default: "New",
    },

    value: {
      type: Number,
      default: 0,
    },

    assignedTo: {
      type: String,
      default: "Sales Team",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Lead", leadSchema);