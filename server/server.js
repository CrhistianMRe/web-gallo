import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors()); // 

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

// Get exercises by path body part id 
app.get("/exercises/name/:id", async (req, res) => {
  const [rows] = await db.query(
    "SELECT exercise_id, exercise.name, exercise.description, exercise.weight_required, exercise.image_url " +
    "FROM exercise " +
    "INNER JOIN exercise_body_part " +
    "ON exercise_body_part.exercise_id = exercise.id " +
    "INNER JOIN body_part " +
    "ON body_part.id = exercise_body_part.body_part_id " +
    "WHERE body_part.name = ?",
    [req.params.id]
  );
  res.json(rows);
});

app.get("/exercises/id/:id", async (req, res) => {
  const [rows] = await db.query(
    "SELECT exercise_id, exercise.name, exercise.description, exercise.weight_required, exercise.image_url " +
    "FROM exercise " +
    "INNER JOIN exercise_body_part " +
    "ON exercise_body_part.exercise_id = exercise.id " +
    "INNER JOIN body_part " +
    "ON body_part.id = exercise_body_part.body_part_id " +
    "WHERE body_part.id = ?",
    [req.params.id]
  );
  res.json(rows);
});

// List of workouts
app.get("/workouts", async (req, res) => {
  try {

    const [rows] = await db.query(`
      SELECT 
        exercise.id AS exercise_id,
        exercise.name AS exercise_name,
        exercise.image_url,
        workout.workout_date,
        workout.workout_length,
        workout_set.rep_amount,
        workout_set.weight_amount,
        workout_set.to_failure
      FROM exercise
      INNER JOIN workout
        ON workout.exercise_id = exercise.id
      INNER JOIN workout_set
        ON workout_set.workout_id = workout.id
    `);

    const [bodyRows] = await db.query(`
      SELECT 
        exercise_body_part.exercise_id,
        body_part.name AS body_part_name
      FROM exercise_body_part
      INNER JOIN body_part 
        ON body_part.id = exercise_body_part.body_part_id
    `);

    const bodyPartsByExercise = {};
    bodyRows.forEach(row => {
      if (!bodyPartsByExercise[row.exercise_id]) {
        bodyPartsByExercise[row.exercise_id] = [];
      }
      bodyPartsByExercise[row.exercise_id].push(row.body_part_name);
    });

    const workouts = {};
    rows.forEach(row => {
      const key = row.workout_date + '_' + row.exercise_name;

      if (!workouts[key]) {
        workouts[key] = {
          exercise_name: row.exercise_name,
          image_url: row.image_url,
          workout_date: row.workout_date,
          workout_length: row.workout_length,
          body_parts: bodyPartsByExercise[row.exercise_id] || [],
          sets: []
        };
      }

      workouts[key].sets.push({
        rep_amount: row.rep_amount,
        weight_amount: row.weight_amount,
        to_failure: row.to_failure
      });
    });

    res.json(Object.values(workouts));

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Add workout
app.post("/workout", async (req, res) => {
  const { workout_date, workout_length, exercise_id } = req.body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const [r] = await conn.query(
      "INSERT INTO workout (workout_date, workout_length, exercise_id) VALUES (?,?,?)",
      [workout_date, workout_length, exercise_id]
    );

    await conn.commit();
    conn.release();
    res.json({ id: r.insertId });

  } catch (err) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ error: err.message });
  }
});

// Add multiple sets
app.post("/workout_sets", async (req, res) => {
  const { sets } = req.body;
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const insertedIds = [];

    for (const s of sets) {
      const [r] = await conn.query(
        "INSERT INTO workout_set (rep_amount, weight_amount, to_failure, workout_id) VALUES (?,?,?,?)",
        [s.rep_amount, s.weight_amount, s.to_failure, s.workout_id]
      );
      insertedIds.push(r.insertId);
    }

    await conn.commit();
    conn.release();

    res.json({ success: true, insertedIds });

  } catch (err) {
    await conn.rollback();
    conn.release();
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log("API running on port 3000"));


