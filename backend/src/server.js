const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const leadRoutes = require("./routes/leads");
const customerRoutes = require("./routes/customers");
const activityRoutes = require("./routes/activities");
const authRoutes = require("./routes/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Enterprise CRM API is running!",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "CRM backend is healthy",
  });
});

app.use("/api/leads", leadRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/auth", authRoutes);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(`CRM server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });
