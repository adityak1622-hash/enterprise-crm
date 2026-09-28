const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await User.deleteMany({});

    const adminPassword = await bcrypt.hash(
      "Admin@123",
      10
    );

    const salesPassword = await bcrypt.hash(
      "Sales@123",
      10
    );

    await User.insertMany([
      {
        name: "Aditya Kumar",
        email: "admin@crm.com",
        password: adminPassword,
        role: "Admin",
      },
      {
        name: "Sales User",
        email: "sales@crm.com",
        password: salesPassword,
        role: "Sales",
      },
    ]);

    console.log("Users created successfully");

    await mongoose.connection.close();
  } catch (error) {
    console.error(error.message);
  }
}

seedUsers();