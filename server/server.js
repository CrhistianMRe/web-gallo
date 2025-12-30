import express from "express";
import mysql from "mysql2/promise";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const db = await mysql.createPool({
  host: "localhost",
  user: "gallo_user",
  password: "minhchi09",
  database: "webgallo",
  port: 3306,
});

// Body parts 
app.get("/body_parts", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM body_part");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get exercises by body part name
app.get("/exercises/name/:id", async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get exercises by body part id
app.get("/exercises/id/:id", async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List workouts (group by workout.id so we can delete precisely)
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
        workout_set.id AS workout_set_id,
        workout_set.rep_amount,
        workout_set.weight_amount,
        workout_set.to_failure
      FROM workout
      INNER JOIN exercise
        ON workout.exercise_id = exercise.id
      LEFT JOIN workout_set
        ON workout_set.workout_id = workout.id
      ORDER BY workout.workout_date DESC, workout.id DESC, workout_set.id ASC
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
    bodyRows.forEach((row) => {
      if (!bodyPartsByExercise[row.exercise_id]) bodyPartsByExercise[row.exercise_id] = [];
      bodyPartsByExercise[row.exercise_id].push(row.body_part_name);
    });

    const workoutsById = new Map();

    rows.forEach((row) => {
      if (!workoutsById.has(row.workout_id)) {
        workoutsById.set(row.workout_id, {
          workout_id: row.workout_id,
          exercise_id: row.exercise_id,
          exercise_name: row.exercise_name,
          image_url: row.image_url,
          workout_date: row.workout_date,
          workout_length: row.workout_length,
          body_parts: bodyPartsByExercise[row.exercise_id] || [],
          sets: [],
        });
      }

      // workout_set is optional (LEFT JOIN)
      if (row.workout_set_id != null) {
        workoutsById.get(row.workout_id).sets.push({
          rep_amount: row.rep_amount,
          weight_amount: row.weight_amount,
          to_failure: row.to_failure,
        });
      }
    });

    res.json(Array.from(workoutsById.values()));
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

// Delete workout (and its sets)
app.delete("/workouts/:id", async (req, res) => {
  const workoutId = Number(req.params.id);
  if (!Number.isInteger(workoutId) || workoutId <= 0) {
    return res.status(400).json({ error: "Invalid workout id" });
  }

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query("SELECT id FROM workout WHERE id = ?", [workoutId]);
    if (!Array.isArray(existing) || existing.length === 0) {
      await conn.rollback();
      conn.release();
      return res.sendStatus(404);
    }

    // Safe regardless of whether FK cascade exists
    await conn.query("DELETE FROM workout_set WHERE workout_id = ?", [workoutId]);
    await conn.query("DELETE FROM workout WHERE id = ?", [workoutId]);

    await conn.commit();
    conn.release();

    // 204 is the standard "success with no response body" for DELETE
    return res.sendStatus(204);
  } catch (err) {
    await conn.rollback();
    conn.release();
    return res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("API running on port 3000"));
