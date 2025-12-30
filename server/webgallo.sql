CREATE DATABASE IF NOT EXISTS webgallo;

USE webgallo;

CREATE TABLE IF NOT EXISTS body_part(
    id bigint NOT NULL,
    name varchar(45) NOT NULL,
    description varchar(200) DEFAULT NULL,
    image_url varchar(255) DEFAULT NULL
);

ALTER TABLE body_part ADD PRIMARY KEY (id);
ALTER TABLE body_part MODIFY id bigint NOT NULL AUTO_INCREMENT;
ALTER TABLE body_part ADD UNIQUE INDEX uq_body_part_name (name ASC) VISIBLE;

CREATE TABLE IF NOT EXISTS exercise(
    id bigint NOT NULL,
    name varchar(60) NOT NULL,
    description varchar(200) DEFAULT NULL,
    weight_required boolean NOT NULL DEFAULT 0,
    image_url varchar(255) DEFAULT NULL
);

ALTER TABLE exercise ADD PRIMARY KEY (id);
ALTER TABLE exercise MODIFY id bigint NOT NULL AUTO_INCREMENT;

CREATE TABLE IF NOT EXISTS exercise_body_part(
    exercise_id bigint NOT NULL,
    body_part_id bigint NOT NULL
);

ALTER TABLE exercise_body_part ADD PRIMARY KEY(exercise_id,body_part_id);

ALTER TABLE exercise_body_part ADD CONSTRAINT fk_exercise_body_part_exercise_id
FOREIGN KEY (exercise_id) REFERENCES exercise(id);
ALTER TABLE exercise_body_part ADD CONSTRAINT fk_exercise_body_part_id
FOREIGN KEY (body_part_id) REFERENCES body_part(id);

CREATE TABLE IF NOT EXISTS workout(
    id bigint NOT NULL,
    workout_date date NOT NULL,
    workout_length decimal(4,2) DEFAULT NULL,
    exercise_id bigint NOT NULL
);

ALTER TABLE workout ADD PRIMARY KEY (id);
ALTER TABLE workout MODIFY id bigint NOT NULL AUTO_INCREMENT;

ALTER TABLE workout ADD CONSTRAINT fk_workout_exercise_id 
FOREIGN KEY (exercise_id) REFERENCES exercise(id);

CREATE TABLE IF NOT EXISTS workout_set(
    id bigint NOT NULL,
    rep_amount int (2) NOT NULL,
    weight_amount decimal(5,2) NOT NULL,
    to_failure boolean NOT NULL DEFAULT 0,
    workout_id bigint NOT NULL
);

ALTER TABLE workout_set ADD PRIMARY KEY (id);
ALTER TABLE workout_set MODIFY id bigint NOT NULL AUTO_INCREMENT;

-- When a workout is deleted, delete its sets automatically (and still safe even if backend deletes sets explicitly)
ALTER TABLE workout_set ADD CONSTRAINT fk_workout_set_workout_id
FOREIGN KEY (workout_id) REFERENCES workout(id)
ON DELETE CASCADE;

-- Insert body parts
INSERT INTO body_part (name, description, image_url) VALUES
('Abdominals', 'Core muscles that stabilize the trunk and help with bending and bracing.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Chest', 'Pectoral muscles used in pressing and pushing movements.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Triceps', 'Back-of-upper-arm muscles that extend the elbow (push strength).', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Shoulders', 'Main shoulder joint movers; used in pressing and overhead lifting.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Deltoids', 'Shoulder cap muscles (anterior/medial/rear) that shape and stabilize the shoulder.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Back', 'Upper and mid back muscles for pulling, posture, and spinal support.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Biceps', 'Front-of-upper-arm muscles that flex the elbow (pull strength).', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Forearms', 'Lower-arm muscles responsible for grip, wrist flexion, and wrist extension.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Glutes', 'Hip extensors that drive power in squats, hip hinges, and thrusts.', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Quadriceps', 'Front thigh muscles that extend the knee (squat and leg press power).', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Hamstrings', 'Back thigh muscles that flex the knee and extend the hip (hinge strength).', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Calves', 'Lower-leg muscles that plantarflex the ankle (standing and jumping strength).', 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png');


-- Insert exercises 
INSERT INTO exercise (name, description, weight_required, image_url) VALUES
('Leg Raises', 'Core move: lift straight legs while keeping lower back controlled.', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Crunch_exercise.svg/960px-Crunch_exercise.svg.png'),
('Ab Crunch Machine', 'Machine-assisted crunch targeting upper abs with controlled range.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Crunch_exercise.svg/960px-Crunch_exercise.svg.png'),

('Leg Press', 'Compound leg press focusing quads, glutes, hamstrings; controlled depth.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/960px-Squats.svg.png'),
('Squats', 'Full-body compound lift emphasizing quads, glutes, and core bracing.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/960px-Squats.svg.png'),
('Leg Extension', 'Isolation exercise for quadriceps; pause at peak contraction.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/960px-Squats.svg.png'),
('Leg Curl', 'Isolation exercise for hamstrings; keep hips stable and control tempo.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/960px-Squats.svg.png'),
('Hip Thrust', 'Glute-focused lift; drive hips up and squeeze at the top.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/960px-Squats.svg.png'),
('Calf Raise on Leg Press', 'Calf work using leg press sled; full stretch and full contraction.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Squats.svg/960px-Squats.svg.png'),

('Dips', 'Bodyweight push movement targeting chest and triceps; keep shoulders safe.', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Push_ups_1.svg/960px-Push_ups_1.svg.png'),
('Incline Dumbbell Press', 'Incline press emphasizing upper chest; stable shoulder path.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Overhead Triceps Extension', 'Triceps isolation overhead; elbows fixed, controlled stretch.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Triceps Pulldown', 'Cable triceps pressdown; keep elbows tucked and avoid swinging.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Cable Fly', 'Chest isolation using cables; bring hands together with slight elbow bend.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Shoulder Press Machine', 'Machine overhead press for shoulders; steady reps without locking hard.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Rear Deltoid Machine', 'Rear-delt isolation; focus on pulling with elbows, not hands.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),

('Push-ups', 'Bodyweight push pattern; rigid plank body and full range.', 0, 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Push_ups_1.svg/960px-Push_ups_1.svg.png'),
('Lat Pulldown', 'Vertical pull targeting lats; pull to upper chest with control.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Seated Machine Row', 'Horizontal row targeting mid-back; squeeze shoulder blades together.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Biceps Curl Machine', 'Biceps isolation with machine support; avoid shoulder swing.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('EZ Bar Curl', 'Free-weight curl using EZ bar; keep elbows fixed and wrists neutral.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('EZ Bar Reverse Curl', 'Reverse-grip curl to emphasize forearms and brachialis.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Shrugs with Barbell', 'Upper-trap work; lift shoulders up, pause, then lower slowly.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Pinch Plates', 'Grip strength drill: pinch weight plates and hold for time.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png'),
('Wrist Curl Dumbbell seated', 'Forearm flexor isolation; controlled curl without bouncing.', 1, 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Gjmnastiko-Noun-dumbbell-4272091.svg/500px-Gjmnastiko-Noun-dumbbell-4272091.svg.png');

-- Insert relations between exercises and body parts
-- Abdominals (id=1)
INSERT INTO exercise_body_part VALUES (1, 1);
INSERT INTO exercise_body_part VALUES (2, 1);

-- Legs (Quadriceps=10, Hamstrings=11, Glutes=9, Calves=12)
INSERT INTO exercise_body_part VALUES (3, 10);
INSERT INTO exercise_body_part VALUES (3, 11);
INSERT INTO exercise_body_part VALUES (3, 9);
INSERT INTO exercise_body_part VALUES (3, 12);

INSERT INTO exercise_body_part VALUES (4, 10);
INSERT INTO exercise_body_part VALUES (4, 11);
INSERT INTO exercise_body_part VALUES (4, 9);

INSERT INTO exercise_body_part VALUES (5, 10);
INSERT INTO exercise_body_part VALUES (6, 11);
INSERT INTO exercise_body_part VALUES (7, 9);
INSERT INTO exercise_body_part VALUES (8, 12);

-- Push (Chest=2, Triceps=3, Shoulders=4, Deltoids=5)
INSERT INTO exercise_body_part VALUES (9, 2);
INSERT INTO exercise_body_part VALUES (9, 3);
INSERT INTO exercise_body_part VALUES (9, 4);

INSERT INTO exercise_body_part VALUES (10, 2);
INSERT INTO exercise_body_part VALUES (11, 3);
INSERT INTO exercise_body_part VALUES (12, 3);
INSERT INTO exercise_body_part VALUES (13, 5);
INSERT INTO exercise_body_part VALUES (14, 4);
INSERT INTO exercise_body_part VALUES (15, 5);

-- Pull (Back=6, Biceps=7, Forearms=8)
-- Push-ups also work Chest, Triceps, Shoulders
INSERT INTO exercise_body_part VALUES (16, 2);
INSERT INTO exercise_body_part VALUES (16, 3);
INSERT INTO exercise_body_part VALUES (16, 4);

INSERT INTO exercise_body_part VALUES (17, 6);
INSERT INTO exercise_body_part VALUES (17, 7);

INSERT INTO exercise_body_part VALUES (18, 6);

INSERT INTO exercise_body_part VALUES (19, 7);
INSERT INTO exercise_body_part VALUES (20, 7);
INSERT INTO exercise_body_part VALUES (21, 8);
INSERT INTO exercise_body_part VALUES (22, 7);
INSERT INTO exercise_body_part VALUES (23, 8);
INSERT INTO exercise_body_part VALUES (24, 8);
