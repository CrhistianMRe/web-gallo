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

  if (res.status === 204) return undefined as T;

  const text = await res.text();
  if (!text) return undefined as T;

  return JSON.parse(text) as T;
}

type AnyRow = Record<string, any>;

function to01(v: any): 0 | 1 {
  if (v === 1 || v === "1" || v === true) return 1;
  return 0;
}

function normalizeExerciseRow(r: AnyRow): ExerciseByBodyPartRow {
  const exercise_id = Number(r.exercise_id ?? r.exerciseId ?? r.id ?? r.exerciseID);
  const name = String(r.name ?? r.exercise_name ?? r.exerciseName ?? "");
  const description =
    (r.description ?? r.exercise_description ?? r.exerciseDescription ?? null) as string | null;

  const weight_required = to01(r.weight_required ?? r.weightRequired ?? r.weight);

  const image_url =
    (r.image_url ?? r.imageUrl ?? r.imageURL ?? null) as string | null;

  return {
    exercise_id: Number.isFinite(exercise_id) ? exercise_id : 0,
    name,
    description,
    weight_required,
    image_url,
  };
}

// === GET endpoints ===

export async function getBodyParts(): Promise<BodyPart[]> {
  return request<BodyPart[]>("/body_parts");
}

export async function getExercisesByBodyPartName(
  bodyPartName: string,
): Promise<ExerciseByBodyPartRow[]> {
  const rows = await request<any[]>(
    `/exercises/name/${encodeURIComponent(bodyPartName)}`,
  );
  return (rows ?? []).map(normalizeExerciseRow);
}

export async function getExercisesByBodyPartId(
  bodyPartId: number,
): Promise<ExerciseByBodyPartRow[]> {
  const rows = await request<any[]>(`/exercises/id/${bodyPartId}`);
  return (rows ?? []).map(normalizeExerciseRow);
}

export async function getWorkouts(): Promise<WorkoutSummary[]> {
  return request<WorkoutSummary[]>("/workouts");
}

// === POST endpoints ===

export async function createWorkout(payload: NewWorkout): Promise<NewWorkoutResponse> {
  return request<NewWorkoutResponse>("/workout", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createWorkoutSets(
  payload: NewWorkoutSetsRequest,
): Promise<NewWorkoutSetsResponse> {
  return request<NewWorkoutSetsResponse>("/workout_sets", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// === DELETE endpoints ===

export async function deleteWorkout(workoutId: number): Promise<void> {
  return request<void>(`/workouts/${workoutId}`, {
    method: "DELETE",
  });
}
