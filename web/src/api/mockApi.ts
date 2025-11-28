import type { Api } from "./base";
import type { Exercise, Workout, NewWorkout } from "../types";

const mockExercises: Exercise[] = [
  {
    id: 1,
    name: "Push-up",
    description: "Bodyweight horizontal push",
    weightRequired: false,
    imageUrl: "/images/pushup.png",
    bodyParts: [
      { id: 1, name: "Chest" },
      { id: 2, name: "Triceps" }
    ]
  },
  {
    id: 2,
    name: "Barbell Squat",
    description: "Heavy lower body compound",
    weightRequired: true,
    imageUrl: "",
    bodyParts: [
      { id: 3, name: "Quads" },
      { id: 4, name: "Glutes" }
    ]
  }
];

let nextWorkoutId = 2;
let nextSetId = 3;

let workouts: Workout[] = [
  {
    id: 1,
    userId: 1,
    date: "2025-11-20T18:00:00.000Z",
    notes: "Felt good, increase weight.",
    sets: [
      { id: 1, exerciseId: 1, reps: 12, toFailure: false },
      { id: 2, exerciseId: 1, reps: 10, toFailure: true }
    ]
  }
];

export const mockApi: Api = {
  async register(email: string, password: string) {
    console.log("mock register", { email, password });
    return { token: "mock-token", userId: 1 };
  },

  async login(email: string, password: string) {
    console.log("mock login", { email, password });
    return { token: "mock-token", userId: 1 };
  },

  async getExercises() {
    await delay(200);
    return mockExercises;
  },

  async getWorkouts() {
    await delay(200);
    return workouts;
  },

  async getWorkout(id: number) {
    await delay(150);
    return workouts.find(w => w.id === id) ?? null;
  },

  async createWorkout(payload: NewWorkout) {
    await delay(200);
    const workout: Workout = {
      ...payload,
      id: nextWorkoutId++,
      sets: payload.sets.map(s => ({
        ...s,
        id: nextSetId++
      }))
    };
    workouts = [...workouts, workout];
    return workout;
  }
};

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
