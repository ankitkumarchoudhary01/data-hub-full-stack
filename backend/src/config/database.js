import mongoose from "mongoose";


const connectDB = async () => {
    const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };
  try {
    await mongoose.connect(process.env.MONGODB_URI,clientOptions);
        await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;