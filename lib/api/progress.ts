import type { ApiMessage } from "@/types/api";
import type {
  CourseProgress,
  UpdateWorkoutProgressRequest,
  WorkoutProgress,
} from "@/types/progress";
import { apiRequest } from "./request";

export function getCourseProgress(
  token: string,
  courseId: string,
): Promise<CourseProgress> {
  const query = new URLSearchParams({
    courseId,
  });

  return apiRequest<CourseProgress>(`/users/me/progress?${query.toString()}`, {
    method: "GET",
    token,
  });
}

export function getWorkoutProgress(
  token: string,
  courseId: string,
  workoutId: string,
): Promise<WorkoutProgress> {
  const query = new URLSearchParams({
    courseId,
    workoutId,
  });

  return apiRequest<WorkoutProgress>(`/users/me/progress?${query.toString()}`, {
    method: "GET",
    token,
  });
}

export function updateWorkoutProgress(
  token: string,
  courseId: string,
  workoutId: string,
  progress: UpdateWorkoutProgressRequest,
): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(
    `/courses/${encodeURIComponent(courseId)}/workouts/${encodeURIComponent(
      workoutId,
    )}`,
    {
      method: "PATCH",
      token,
      body: progress,
    },
  );
}

export function resetWorkoutProgress(
  token: string,
  courseId: string,
  workoutId: string,
): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(
    `/courses/${encodeURIComponent(courseId)}/workouts/${encodeURIComponent(
      workoutId,
    )}/reset`,
    {
      method: "PATCH",
      token,
    },
  );
}

export function resetCourseProgress(
  token: string,
  courseId: string,
): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(
    `/courses/${encodeURIComponent(courseId)}/reset`,
    {
      method: "PATCH",
      token,
    },
  );
}
