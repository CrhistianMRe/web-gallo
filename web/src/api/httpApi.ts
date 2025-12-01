import {
  BodyPart,
  ExerciseByBodyPartRow,
  WorkoutSummary,
  NewWorkout,
  NewWorkoutResponse,
  NewWorkoutSetsRequest,
  NewWorkoutSetsResponse,
} from "../types";

const BASE_URL = "http://localhost:3000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// === GET endpoints ===

// GET /body_parts
export async function getBodyParts(): Promise<BodyPart[]> {
  return request<BodyPart[]>("/body_parts");
}

// GET /exercises/name/:id   (id is actually body_part.name)
export async function getExercisesByBodyPartName(
  bodyPartName: string,
): Promise<ExerciseByBodyPartRow[]> {
  return request<ExerciseByBodyPartRow[]>(
    `/exercises/name/${encodeURIComponent(bodyPartName)}`,
  );
}

// GET /exercises/id/:id   (id is body_part.id)
export async function getExercisesByBodyPartId(
  bodyPartId: number,
): Promise<ExerciseByBodyPartRow[]> {
  return request<ExerciseByBodyPartRow[]>(`/exercises/id/${bodyPartId}`);
}

// GET /workouts
export async function getWorkouts(): Promise<WorkoutSummary[]> {
  return request<WorkoutSummary[]>("/workouts");
}

// === POST endpoints ===

// POST /workout  -> { id }
export async function createWorkout(
  payload: NewWorkout,
): Promise<NewWorkoutResponse> {
  return request<NewWorkoutResponse>("/workout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// POST /workout_sets  -> { success, insertedIds?, error? }
export async function createWorkoutSets(
  payload: NewWorkoutSetsRequest,
): Promise<NewWorkoutSetsResponse> {
  return request<NewWorkoutSetsResponse>("/workout_sets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
