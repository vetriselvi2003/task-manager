const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "No token" });

  const decoded = jwt.verify(token, "secretkey");
  req.userId = decoded.userId;

  next();
};
router.post("/", authMiddleware, async (req, res) => {
  const task = new Task({
    ...req.body,
    user: req.userId
  });

  const savedTask = await task.save();
  res.json(savedTask);
});

router.get("/", authMiddleware, async (req, res) => {
  const tasks = await Task.find({ user: req.userId });
  res.json(tasks);
});
// Create task
router.post("/", async (req, res) => {
  const task = new Task(req.body);
  const savedTask = await task.save();
  res.json(savedTask);
});

// Get all tasks
router.get("/", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

// Update task
router.put("/:id", async (req, res) => {
  const updatedTask = await Task.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updatedTask);
});

// Delete task
router.delete("/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  res.json({ message: "Task deleted" });
});

module.exports = router;