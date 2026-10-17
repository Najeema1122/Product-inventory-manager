const mongoose = require("mongoose");

const connectDb = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MONGO_URI is missing from the .env file.");
  }

  await mongoose.connect(mongoUri);
  console.log("Connected to MongoDB Atlas");
};

module.exports = connectDb;