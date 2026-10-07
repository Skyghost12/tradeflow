import mongoose from "mongoose";

/**
 * Connects to MongoDB using Mongoose.
 * Fails fast on startup if the connection can't be established —
 * a trading app should never silently run without a database.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
