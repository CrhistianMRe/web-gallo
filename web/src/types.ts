export interface BodyPart {
  id: number;
  name: string;
}

export interface Exercise {
  id: number;
  name: string;
  description?: string;
  weightRequired: boolean;
  imageUrl?: string;
  bodyParts: BodyPart[];
}

export interface WorkoutSet {
  id: number;
  exerciseId: number;
  reps: number;
  weight?: number; // undefined for bodyweight
  toFailure: boolean;
}

export interface Workout {
  id: number;
  userId: number;
  date: string; // ISO string
  notes?: string;
  sets: WorkoutSet[];
}

// Types used when creating new data
export type NewWorkoutSet = Omit<WorkoutSet, "id">;

export interface NewWorkout {
  userId: number;
  date: string;
  notes?: string;
  sets: NewWorkoutSet[];
}
