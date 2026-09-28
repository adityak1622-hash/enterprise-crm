const mongoose = require("mongoose");
require("dotenv").config();

const Lead = require("./models/Lead");

const leads = [
  {
    name: "Rahul Sharma",
    email: "rahul@techcorp.com",
    phone: "9876543210",
    company: "TechCorp",
    source: "LinkedIn",
    stage: "Qualified",
    value: 75000,
    assignedTo: "Aditya",
  },
  {
    name: "Priya Mehta",
    email: "priya@startup.io",
    phone: "9988776655",
    company: "Startup.io",
    source: "Website",
    stage: "Proposal",
    value: 120000,
    assignedTo: "Aditya",
  },
  {
    name: "Amit Patel",
    email: "amit@globalsoft.com",
    phone: "9123456780",
    company: "GlobalSoft",
    source: "Referral",
    stage: "Negotiation",
    value: 250000,
    assignedTo: "Sales Team",
  },
  {
    name: "Sneha Kapoor",
    email: "sneha@designhub.com",
    phone: "9090909090",
    company: "DesignHub",
    source: "Advertisement",
    stage: "New",
    value: 50000,
    assignedTo: "Sales Team",
  },
  {
    name: "Vikram Singh",
    email: "vikram@finserve.com",
    phone: "9988001122",
    company: "FinServe",
    source: "LinkedIn",
    stage: "Won",
    value: 300000,
    assignedTo: "Aditya",
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Lead.deleteMany();
    await Lead.insertMany(leads);

    console.log("Sample leads inserted successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error("Seed error:", error.message);
  }
}

seedDatabase();