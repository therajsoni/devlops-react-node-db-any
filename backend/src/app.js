//  sql
const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
const app = express();
const MODE = process.env.NODE_MODE || "DEVELOPMENT";
const PORT = process.env.PORT_SQL;

app.use(cors());
app.use(express.json());

if (MODE === "PRODUCTION") {
  console.clear();
}

// --------------------
// ✅ MySQL Connection
// --------------------
let db;
(async () => {
  try {
    db = await mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("✅ Connected to MySQL");
  } catch (e) {
    console.error("❌ MySQL Connection Error:", e.message);
  }
})();

// --------------------
// ✅ Routes
// --------------------
app.get("/", (req, res) => res.send("<h1>APP HEALTH CHECK API</h1>"));

app.get("/get-todo", async (req, res) => {
  try {
    const [todos] = await db.query("SELECT * FROM todos ORDER BY id DESC");
    res.status(200).json({ todos, success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/post-todo", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Name is required" });

    await db.query("INSERT INTO todos (name) VALUES (?)", [name]);
    res.status(201).json({ success: true, message: "Todo created" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// --------------------
// ✅ Server
// --------------------
app.listen(PORT, () => {
  console.log(`🚀 App backend running on http://localhost:${PORT} (${MODE})`);
});
