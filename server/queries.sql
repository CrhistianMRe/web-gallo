
-- Body parts list

SELECT * FROM body_part


-- List of exercises by body part name/id
SELECT exercise_id, exercise.name, exercise.description, exercise.weight_required, exercise.image_url
FROM exercise 
INNER JOIN exercise_body_part 
ON exercise_body_part.exercise_id = exercise.id
INNER JOIN body_part 
ON body_part.id = exercise_body_part.body_part_id
WHERE body_part.name = "Chest"
-- WHERE body_part.id = 1


-- List of workouts with sets, weight amount, to_failure, exercise name, and body part name

SELECT exercise.name AS exercise_name, exercise.image_url, workout.workout_date, workout.workout_length, workout_set.rep_amount, workout_set.weight_amount, workout_set.to_failure, body_part.name AS body_part_name
FROM exercise
INNER JOIN exercise_body_part
ON exercise_body_part.exercise_id = exercise.id
INNER JOIN body_part
ON body_part.id = exercise_body_part.body_part_id
INNER JOIN workout
ON workout.exercise_id = exercise.id
INNER JOIN workout_set
ON workout_set.workout_id = workout.id

