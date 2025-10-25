const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const app = express();
const MODE = process.env.NODE_MODE;
const PORT = process.env.PORT;
const dbConnection = process.env.DBCONNECTIONSTRING;

app.use(cors());
app.use(express.json());
if (MODE === "PRODUCTION") {
  console.clear();
}
// connect to DB
mongoose
  .connect(dbConnection)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((e) => console.log("❌ DB Connection Error:", e.message));

// model
const Todo = new mongoose.Schema({ name: String }, { timestamps: true });
const todoModel = mongoose.model("Todo", Todo);

// routes
app.get("/", (req, res) => res.send("<h1>APP HEALTH CHECK API</h1>"));

app.get("/get-todo", async (req, res) => {
  const todos = await todoModel.find({});
  res.status(200).json({ todos, success: true });
});

app.post("/post-todo", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });
    }
    await todoModel.create({ name });
    res.status(201).json({ success: true, message: "Todo created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 App backend running on http://localhost:${PORT} (${MODE})`);
});
