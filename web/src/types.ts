// Body part row from GET /body_parts
export interface BodyPart {
  id: number;
  name: string;
}

// Row shape returned by /exercises/name/:id and /exercises/id/:id
export interface ExerciseByBodyPartRow {
  exercise_id: number;
  name: string;
  description: string | null;
  weight_required: 0 | 1;  // TINYINT(1) in MySQL/MariaDB
  image_url: string | null;
}

// One set within a workout returned by GET /workouts
export interface WorkoutSetSummary {
  rep_amount: number;
  weight_amount: number;
  to_failure: 0 | 1;
}

// Aggregated workout object returned by GET /workouts
export interface WorkoutSummary {
  exercise_name: string;
  image_url: string | null;
  workout_date: string;            // 'YYYY-MM-DD'
  workout_length: number | string; // DECIMAL(4,2)
  body_parts: string[];
  sets: WorkoutSetSummary[];
}

// Payload for POST /workout
export interface NewWorkout {
  workout_date: string;
  workout_length: number;
  exercise_id: number;
}

// Single set in the POST /workout_sets payload
export interface NewWorkoutSetPayload {
  rep_amount: number;
  weight_amount: number;
  to_failure: 0 | 1;
  workout_id: number;
}

// Payload for POST /workout_sets
export interface NewWorkoutSetsRequest {
  sets: NewWorkoutSetPayload[];
}

// Response from POST /workout
export interface NewWorkoutResponse {
  id: number;
}

// Response from POST /workout_sets
export interface NewWorkoutSetsResponse {
  success: boolean;
  insertedIds?: number[];
  error?: string;
}
