require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✅"))
  .catch((err) => console.log(err));
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running...");
});
const taskRoutes = require("./routes/taskRoutes");
app.use("/api/tasks", taskRoutes);
app.listen(5000, () => {
  console.log("Server running on port 5000");
});