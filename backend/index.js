// ----------------------
// Import required modules
// ----------------------
const express = require("express");            // Express → helps create HTTP API routes easily
const cors = require("cors");                  // CORS → allows frontend (different origin) to call backend
const sqlite3 = require("sqlite3").verbose();  // SQLite3 driver for Node.js (verbose gives debug info)
const path = require("path");                  // Path → helps handle file paths across OS

// ----------------------
// Initialize Express app
// ----------------------
const app = express();
const PORT = 8000; // Port where backend will run

// ----------------------
// Middleware
// ----------------------
app.use(cors());               // Enable CORS → frontend can call backend from browser
app.use(express.json());       // Parse incoming JSON in request body
app.use(express.static(path.join(__dirname, "../frontend"))); // Serve static frontend files

// ----------------------
// Database Setup
// ----------------------
// Create or open SQLite database file "db.sqlite"
// If file does not exist, SQLite automatically creates it
const db = new sqlite3.Database("./db.sqlite", (err) => {
  if (err) console.error("Error opening database", err.message);
  else console.log("Connected to SQLite database");
});

// ----------------------
// Test Routes
// ----------------------

// Test API → visit http://localhost:8000/api
app.get("/api", (req, res) => {
  res.json({ message: "API is running 🚀" });
});

// Serve frontend index.html → visit http://localhost:8000/
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ----------------------
// CRUD Routes (Users, Modules, Class Schedules, Assessments)
// ----------------------

// ----------------------
// USERS
// ----------------------

// GET all users → frontend example:
/*
fetch('http://localhost:8000/api/users')
  .then(res => res.json())
  .then(users => console.log(users));
*/
app.get("/api/users", (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new user → frontend example:
/*
fetch('http://localhost:8000/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'test@example.com', password_hash: '1234' })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.post("/api/users", (req, res) => {
  const { email, password_hash } = req.body;
  db.run(
    "INSERT INTO users (email, password_hash) VALUES (?, ?)",
    [email, password_hash],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PUT update a user by ID → frontend example:
/*
fetch('http://localhost:8000/api/users/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'newemail@example.com', password_hash: '4321' })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.put("/api/users/:id", (req, res) => {
  const { email, password_hash } = req.body;
  db.run(
    "UPDATE users SET email = COALESCE(?, email), password_hash = COALESCE(?, password_hash) WHERE id = ?",
    [email, password_hash, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE a user by ID → frontend example:
/*
fetch('http://localhost:8000/api/users/1', { method: 'DELETE' })
  .then(res => res.json())
  .then(data => console.log(data));
*/
app.delete("/api/users/:id", (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// ----------------------
// MODULES
// ----------------------

// GET all modules → frontend example:
/*
fetch('http://localhost:8000/api/modules')
  .then(res => res.json())
  .then(modules => console.log(modules));
*/
app.get("/api/modules", (req, res) => {
  db.all("SELECT * FROM modules", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST a new module → frontend example:
/*
fetch('http://localhost:8000/api/modules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Math', code: 'MATH101', credits: 3, user_id: 1 })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.post("/api/modules", (req, res) => {
  const { name, code, credits, user_id } = req.body;
  db.run(
    "INSERT INTO modules (name, code, credits, user_id) VALUES (?, ?, ?, ?)",
    [name, code, credits, user_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PUT update a module by ID → frontend example:
/*
fetch('http://localhost:8000/api/modules/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Physics', code: 'PHYS101', credits: 4, user_id: 1 })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.put("/api/modules/:id", (req, res) => {
  const { name, code, credits, user_id } = req.body;
  db.run(
    "UPDATE modules SET name = COALESCE(?, name), code = COALESCE(?, code), credits = COALESCE(?, credits), user_id = COALESCE(?, user_id) WHERE id = ?",
    [name, code, credits, user_id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE a module by ID → frontend example:
/*
fetch('http://localhost:8000/api/modules/1', { method: 'DELETE' })
  .then(res => res.json())
  .then(data => console.log(data));
*/
app.delete("/api/modules/:id", (req, res) => {
  db.run("DELETE FROM modules WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// ----------------------
// CLASS SCHEDULES
// ----------------------

// GET all schedules → frontend example:
/*
fetch('http://localhost:8000/api/class_schedules')
  .then(res => res.json())
  .then(data => console.log(data));
*/
app.get("/api/class_schedules", (req, res) => {
  db.all("SELECT * FROM class_schedules", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new schedule → frontend example:
/*
fetch('http://localhost:8000/api/class_schedules', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ day_of_week: 'Monday', start_time: '09:00', end_time: '10:30', location: 'Room 101', module_id: 1 })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.post("/api/class_schedules", (req, res) => {
  const { day_of_week, start_time, end_time, location, module_id } = req.body;
  db.run(
    "INSERT INTO class_schedules (day_of_week, start_time, end_time, location, module_id) VALUES (?, ?, ?, ?, ?)",
    [day_of_week, start_time, end_time, location, module_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PUT update schedule → frontend example:
/*
fetch('http://localhost:8000/api/class_schedules/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ day_of_week: 'Tuesday', start_time: '10:00', end_time: '11:30', location: 'Room 102', module_id: 1 })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.put("/api/class_schedules/:id", (req, res) => {
  const { day_of_week, start_time, end_time, location, module_id } = req.body;
  db.run(
    "UPDATE class_schedules SET day_of_week = COALESCE(?, day_of_week), start_time  = COALESCE(?, start_time), end_time    = COALESCE(?, end_time), "+
    " location = COALESCE(?, location),    module_id   = COALESCE(?, module_id) WHERE id = ?",
    [day_of_week, start_time, end_time, location, module_id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE schedule → frontend example:
/*
fetch('http://localhost:8000/api/class_schedules/1', { method: 'DELETE' })
  .then(res => res.json())
  .then(data => console.log(data));
*/
app.delete("/api/class_schedules/:id", (req, res) => {
  db.run(
    "DELETE FROM class_schedules WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// ----------------------
// ASSESSMENTS
// ----------------------

// GET all assessments → frontend example:
/*
fetch('http://localhost:8000/api/assessments')
  .then(res => res.json())
  .then(data => console.log(data));
*/
app.get("/api/assessments", (req, res) => {
  db.all("SELECT * FROM assessments", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// POST new assessment → frontend example:
/*
fetch('http://localhost:8000/api/assessments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Exam 1', type: 'Exam', due_date: '2025-09-30', module_id: 1 })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.post("/api/assessments", (req, res) => {
  const { title, type, due_date, module_id } = req.body;
  db.run(
    "INSERT INTO assessments (title, type, due_date, module_id) VALUES (?, ?, ?, ?)",
    [title, type, due_date, module_id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

// PUT update assessment → frontend example:
/*
fetch('http://localhost:8000/api/assessments/1', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title: 'Exam 1 Updated', type: 'Exam', due_date: '2025-10-01', module_id: 1 })
})
.then(res => res.json())
.then(data => console.log(data));
*/
app.put("/api/assessments/:id", (req, res) => {
  const { title, type, due_date, module_id } = req.body;
  db.run(
    "UPDATE assessments SET title     = COALESCE(?, title), type = COALESCE(?, type), due_date  = COALESCE(?, due_date), module_id = COALESCE(?, module_id) WHERE id = ?",
    [title, type, due_date, module_id, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ changes: this.changes });
    }
  );
});

// DELETE assessment → frontend example:
/*
fetch('http://localhost:8000/api/assessments/1', { method: 'DELETE' })
  .then(res => res.json())
  .then(data => console.log(data));
*/
app.delete("/api/assessments/:id", (req, res) => {
  db.run("DELETE FROM assessments WHERE id = ?", [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ changes: this.changes });
  });
});

// ----------------------
// Start server
// ----------------------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
