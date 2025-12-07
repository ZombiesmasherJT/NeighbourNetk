const express = require("express");
const app = express();
const PORT = 5000;

// Middleware to read JSON
app.use(express.json());

// -----------------------------
// In-memory storage (TEMP)
// -----------------------------
let helpRequests = [];

// -----------------------------
// POST /api/help-requests
// Create a help request
// -----------------------------
app.post("/api/help-requests", (req, res) => {
  const { title, description, name } = req.body;

  if (!title || !description || !name) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const newRequest = {
    id: Date.now(),
    title,
    description,
    name,
    createdAt: new Date(),
    responses: []
  };

  helpRequests.push(newRequest);

  res.status(201).json(newRequest);
});

// -----------------------------
// GET /api/help-requests
// Get all help requests
// -----------------------------
app.get("/api/help-requests", (req, res) => {
  res.json(helpRequests);
});

// -----------------------------
// Start Server
// -----------------------------
app.listen(PORT, () => {
  console.log(`NeighbourNetk API running on http://localhost:${PORT}`);
});
