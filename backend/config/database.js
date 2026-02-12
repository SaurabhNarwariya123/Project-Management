// config/database.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ MongoDB Connected:", conn.connection.host);
    console.log("✅ Database Name:", conn.connection.name);
    
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error.message);
    console.log("🔄 Retrying connection in 5 seconds...");
    setTimeout(connectDB, 5000);
  }
};

module.exports = connectDB;