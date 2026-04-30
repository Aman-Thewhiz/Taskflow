const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");

const app = express();

/* ---------------- CORS CONFIG ---------------- */
const allowedOrigins = [
  "http://localhost:5173",
  "https://taskflow-teal-tau.vercel.app",
];

// allow requests with no origin (e.g. Postman) + whitelisted origins
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
};

/* IMPORTANT: only one CORS middleware, no app.options("*") */
app.use(cors(corsOptions));

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "TaskFlow API running",
    data: null,
  });
});

/* ---------------- 404 ---------------- */
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    data: null,
  });
});

/* ---------------- ERROR HANDLER ---------------- */
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: err.message,
      data: null,
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      success: false,
      message: "Invalid JSON body",
      data: null,
    });
  }

  console.error("Unhandled server error:", err);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    data: null,
  });
});

module.exports = app;