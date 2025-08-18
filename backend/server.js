require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const certificateRoutes = require("./routes/certificateRoutes");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: "*",   // allow frontend/ngrok requests
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
// MongoDB
connectDB();

// Routes
app.use("/api/users", userRoutes);
app.use("/api/certificates", certificateRoutes);

// Default route
app.get("/", (req, res) => {
  res.send("Backend running");
});

app.get("/ping", (req, res) => {
  res.json({ msg: "pong" });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("🚀 Server running successfully"));
