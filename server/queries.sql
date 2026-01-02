USE webgallo;

-- Body parts list (includes description + image_url)
SELECT id, name, description, image_url
FROM body_part
ORDER BY id;

-- Verify body part media fields are populated (should return 0 rows)
SELECT id, name, description, image_url
FROM body_part
WHERE description IS NULL OR image_url IS NULL
ORDER BY id;

-- Exercise catalog (includes description + image_url)
SELECT id, name, description, weight_required, image_url
FROM exercise
ORDER BY id;

-- Verify exercise media fields are populated (should return 0 rows)
SELECT id, name, description, image_url
FROM exercise
WHERE description IS NULL OR image_url IS NULL
ORDER BY id;

-- List exercises by body part NAME
SELECT
  ebp.exercise_id AS exercise_id,
  e.name,
  e.description,
  e.weight_required,
  e.image_url
FROM exercise e
INNER JOIN exercise_body_part ebp
  ON ebp.exercise_id = e.id
INNER JOIN body_part bp
  ON bp.id = ebp.body_part_id
WHERE bp.name = 'Chest'
ORDER BY e.id;

-- List exercises by body part ID
SELECT
  ebp.exercise_id AS exercise_id,
  e.name,
  e.description,
  e.weight_required,
  e.image_url
FROM exercise e
INNER JOIN exercise_body_part ebp
  ON ebp.exercise_id = e.id
INNER JOIN body_part bp
  ON bp.id = ebp.body_part_id
WHERE bp.id = 1
ORDER BY e.id;

-- Workouts with sets (raw joined rows; one row per set)
SELECT
  w.id AS workout_id,
  w.workout_date,
  w.workout_length,
  w.exercise_id,
  e.name AS exercise_name,
  e.image_url,
  ws.id AS workout_set_id,
  ws.rep_amount,
  ws.weight_amount,
  ws.to_failure
FROM workout w
INNER JOIN exercise e
  ON e.id = w.exercise_id
LEFT JOIN workout_set ws
  ON ws.workout_id = w.id
ORDER BY w.workout_date DESC, w.id DESC, ws.id ASC;

-- Delete a workout
-- Because workout_set.workout_id has ON DELETE CASCADE, this deletes the workout AND its sets.
DELETE FROM workout WHERE id = 1;
