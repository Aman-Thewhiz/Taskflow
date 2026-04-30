const mongoose = require("mongoose");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;
  const retries = Number(process.env.MONGO_CONNECT_RETRIES || 1);
  const retryDelay = Number(process.env.MONGO_CONNECT_RETRY_DELAY_MS || 3000);
  const family = process.env.MONGO_DNS_FAMILY
    ? Number(process.env.MONGO_DNS_FAMILY)
    : undefined;

  if (!mongoUri) {
    console.error("MONGODB_URI is not set");
    process.exit(1);
  }

  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        ...(family ? { family } : {}),
      });
      console.log(`MongoDB connected: ${conn.connection.host}`);
      return;
    } catch (error) {
      console.error(
        `MongoDB connection error (attempt ${attempt}/${retries}):`,
        error.message
      );

      if (attempt === retries) {
        process.exit(1);
      }

      await wait(retryDelay);
    }
  }
};

module.exports = connectDB;
