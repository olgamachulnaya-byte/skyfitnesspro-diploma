import type { ApiMessage } from "@/types/api";
import type { User } from "@/types/user";
import { apiRequest } from "./request";

export function getCurrentUser(token: string): Promise<User> {
  return apiRequest<User>("/users/me", {
    method: "GET",
    token,
  });
}

export function addCourseToUser(
  token: string,
  courseId: string,
): Promise<ApiMessage> {
  return apiRequest<ApiMessage>("/users/me/courses", {
    method: "POST",
    token,
    body: {
      courseId,
    },
  });
}

export function removeCourseFromUser(
  token: string,
  courseId: string,
): Promise<ApiMessage> {
  return apiRequest<ApiMessage>(
    `/users/me/courses/${encodeURIComponent(courseId)}`,
    {
      method: "DELETE",
      token,
    },
  );
}