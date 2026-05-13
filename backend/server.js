require("dotenv").config(); // Fixed: Removed the path with the space
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/test", (req, res) => {
  res.send("The server is definitely updated and running!");
});



// Import Routes
const applicationRoutes = require("./routes/applications");
app.use("/application", applicationRoutes);

// Replace the old long string with this SRV string
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 60000
})
.then(() => console.log("✅ MongoDB connected!"))
  .catch((err) => console.log("❌ MongoDB error:", err.message));
    console.error(err.stack); 
    
    res.status(500).json({ success: false, error: err.message });

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Admin Panel API running on Port ${PORT}`);
});