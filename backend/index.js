// Import required modules
const express = require("express");      // Express framework → helps create HTTP API routes easily
const cors = require("cors");            // CORS middleware → allows frontend (different origin) to call backend
const sqlite3 = require("sqlite3").verbose(); // SQLite3 database driver for Node.js (verbose gives debug info)
const path = require("path");            // Path module → helps handle file paths across OS

// Create an Express app instance
const app = express();

// Port number where the backend will run
const PORT = 8000;

// ----------------------
// Middleware
// ----------------------

// Enable CORS so frontend (running in browser) can talk to backend
app.use(cors());

// Parse incoming requests with JSON bodies (e.g., POST { "name": "Math" })
app.use(express.json());

// Serve static frontend files (HTML, CSS, JS) from ../frontend folder
// Example: http://localhost:8000/index.html will load frontend/index.html
app.use(express.static(path.join(__dirname, "../frontend")));

// ----------------------
// Database Setup
// ----------------------

// Create or open SQLite database file "db.sqlite"
// If the file does not exist, SQLite will create it automatically
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) {
    // If there’s a problem opening the database, log the error
    console.error("Error opening database", err.message);
  } else {
    // Otherwise confirm DB is ready
    console.log("Connected to SQLite database");
  }
});

// ----------------------
// Routes (API endpoints)
// ----------------------

// Simple test route → visit http://localhost:8000/api
// Returns JSON response so you can confirm API is alive
app.get("/api", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// ----------------------
// Start Server
// ----------------------

// Start backend server on port 8000
// Now you can access it via http://localhost:8000
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
