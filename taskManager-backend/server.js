const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

// -------------------- User Schema --------------------
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// -------------------- Task Schema --------------------
const taskSchema = new mongoose.Schema({
  text: String,
  completed: { type: Boolean, default: false },
});
const Task = mongoose.model("Task", taskSchema);

// -------------------- MongoDB Connection --------------------
mongoose
  .connect("mongodb://127.0.0.1:27017/mydb")
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// -------------------- Auth Routes --------------------

// Register
app.post("/auth/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, "mysecretkey", { expiresIn: "1h" });
    res.status(201).json({ message: "User registered", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
app.post("/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, "mysecretkey", { expiresIn: "1h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// -------------------- Task Routes --------------------
app.get("/", (req, res) => {
  res.send("A Simple Task Manager with Auth");
});

app.post("/submit", async (req, res) => {
  const { text, completed = false } = req.body;
  try {
    const newTask = new Task({ text, completed });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

app.patch("/tasks/:id/toggle", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: "Unable to toggle task" });
  }
});

app.delete("/tasks/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Unable to delete task" });
  }
});

// -------------------- Start server --------------------
app.listen(5000, "0.0.0.0", () => {
  console.log("🚀 Server running on port 5000");
});
