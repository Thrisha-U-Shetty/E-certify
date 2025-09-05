require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const requestRoutes =require("./routes/requestRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();
 app.use(cors({
  origin: "*",   // allow frontend/ngrok requests
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// MongoDB
connectDB();

// Routes
app.use("/api/certificates", certificateRoutes);
app.use("/api/requests", requestRoutes);

// Default route
app.get("/", (req, res) => res.send("Backend running"));
app.get("/ping", (req, res) => res.json({ msg: "pong" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running successfully"));
