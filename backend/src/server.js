require("dotenv").config();
const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { validateEnv } = require("./config/env");
const { initSocket } = require("./socket");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    validateEnv();
    await connectDB();
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }

  const server = http.createServer(app);
  initSocket(server);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  process.on("SIGTERM", () => {
    console.log("SIGTERM received. Closing server.");
    server.close(() => process.exit(0));
  });
};

startServer();
