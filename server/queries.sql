
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


