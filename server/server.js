import express from "express";
import mysql from "mysql2/promise";

const app = express();
app.use(express.json());

const db = await mysql.createPool({
  host: "localhost",
  user: "root3",
  password: "toor",
  database: "webgallo",
  port: 3306
});


// get all body parts
app.get("/body_parts", async (req, res) => {
  const [rows] = await db.query("SELECT * FROM body_part");
  res.json(rows);
});



app.listen(3000, () => console.log("API running on port 3000"));

