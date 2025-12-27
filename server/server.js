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
        workout.id AS workout_id,
        exercise.id AS exercise_id,
        exercise.name AS exercise_name,
        exercise.image_url,
        workout.workout_date,
        workout.workout_length,
        workout_set.rep_amount,
        workout_set.weight_amount,
        workout_set.to_failure,
        body_part.name AS body_part_name
      FROM workout
      INNER JOIN exercise
        ON workout.exercise_id = exercise.id
      INNER JOIN workout_set
        ON workout_set.workout_id = workout.id
      LEFT JOIN exercise_body_part
        ON exercise_body_part.exercise_id = exercise.id
      LEFT JOIN body_part
        ON body_part.id = exercise_body_part.body_part_id
    `);

    // Agrupar workouts por id
    const workouts = {};

    rows.forEach(row => {
      const key = row.workout_id;

      if (!workouts[key]) {
        workouts[key] = {
          workout_id: row.workout_id,
          exercise_name: row.exercise_name,
          image_url: row.image_url,
          workout_date: row.workout_date,
          workout_length: row.workout_length,
          body_parts: row.body_part_name ? [row.body_part_name] : [],
          sets: []
        };
      } else if (row.body_part_name && !workouts[key].body_parts.includes(row.body_part_name)) {
        // Evitar duplicados de body_parts
        workouts[key].body_parts.push(row.body_part_name);
      }

      workouts[key].sets.push({
        rep_amount: row.rep_amount,
        weight_amount: row.weight_amount,
        to_failure: row.to_failure
      });
    });

    res.json(Object.values(workouts));

  } catch (err) {
    console.error(err);
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


// Delete workout sets by workout id
app.delete("/workout/:id", async (req, res) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "DELETE FROM workout_set WHERE workout_id = ?",
      [req.params.id]
    );

    await connection.commit();

    res.json({
      success: true,
      workoutId: req.params.id,
      deletedRows: result.affectedRows,
      message:
        result.affectedRows > 0
          ? "Workout sets deleted successfully"
          : "No workout sets found for this workout"
    });

  } catch (err) {
    await connection.rollback();

    res.status(500).json({
      success: false,
      error: err.message
    });

  } finally {
    connection.release();
  }
});


app.listen(3000, () => console.log("API running on port 3000"));


