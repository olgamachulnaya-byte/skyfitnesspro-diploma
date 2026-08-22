import type { Course } from "@/types/course";
import type { Workout } from "@/types/workout";
import { apiRequest } from "./request";

export function getCourses(): Promise<Course[]> {
  return apiRequest<Course[]>("/courses", {
    method: "GET",
  });
}

export function getCourseById(courseId: string): Promise<Course> {
  return apiRequest<Course>(
    `/courses/${encodeURIComponent(courseId)}`,
    {
      method: "GET",
    },
  );
}

export function getCourseWorkouts(
  token: string,
  courseId: string,
): Promise<Workout[]> {
  return apiRequest<Workout[]>(
    `/courses/${encodeURIComponent(courseId)}/workouts`,
    {
      method: "GET",
      token,
    },
  );
}