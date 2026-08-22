import type { Workout } from "@/types/workout";
import { apiRequest } from "./request";

export function getWorkoutById(
  token: string,
  workoutId: string,
): Promise<Workout> {
  return apiRequest<Workout>(
    `/workouts/${encodeURIComponent(workoutId)}`,
    {
      method: "GET",
      token,
    },
  );
}