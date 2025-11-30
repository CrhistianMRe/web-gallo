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

// List of workouts
app.get("/workouts", async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT
            exercise.name AS exercise_name,
            exercise.image_url,
            workout.workout_date,
            workout.workout_length,
            workout_set.rep_amount,
            workout_set.weight_amount,
            workout_set.to_failure,
            body_part.name AS body_part_name
            FROM exercise
            INNER JOIN exercise_body_part
            ON exercise_body_part.exercise_id = exercise.id
            INNER JOIN body_part
            ON body_part.id = exercise_body_part.body_part_id
            INNER JOIN workout
            ON workout.exercise_id = exercise.id
            INNER JOIN workout_set
            ON workout_set.workout_id = workout.id
            `);

        const workouts = {};
        rows.forEach(row => {
            const key = row.workout_date + '_' + row.exercise_name;
            if (!workouts[key]) {
                workouts[key] = {
                    exercise_name: row.exercise_name,
                    image_url: row.image_url,
                    workout_date: row.workout_date,
                    workout_length: row.workout_length,
                    body_parts: [row.body_part_name],
                    sets: []
                };
            } else if (!workouts[key].body_parts.includes(row.body_part_name)) {
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
        res.status(500).json({ error: err.message });
    }
});



app.listen(3000, () => console.log("API running on port 3000"));

