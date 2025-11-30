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

//Get exercises by path body part id 
app.get("/exercises/name/:id", async (req, res) => {
    const [rows] = await db.query(
"SELECT exercise_id, exercise.name, exercise.description, exercise.weight_required, exercise.image_url "
+ "FROM exercise "
+ "INNER JOIN exercise_body_part "
+ "ON exercise_body_part.exercise_id = exercise.id "
+ "INNER JOIN body_part "
+ "ON body_part.id = exercise_body_part.body_part_id "
+ "WHERE body_part.name = ?",
        [req.params.id]
    );
    res.json(rows);
});

app.get("/exercises/id/:id", async (req, res) => {
    const [rows] = await db.query(
"SELECT exercise_id, exercise.name, exercise.description, exercise.weight_required, exercise.image_url "
+ "FROM exercise "
+ "INNER JOIN exercise_body_part "
+ "ON exercise_body_part.exercise_id = exercise.id "
+ "INNER JOIN body_part "
+ "ON body_part.id = exercise_body_part.body_part_id "
+ "WHERE body_part.id = ?",
        [req.params.id]
    );
    res.json(rows);
});

app.listen(3000, () => console.log("API running on port 3000"));

