import type { ApiMessage } from "@/types/api";
import type { User } from "@/types/user";
import { apiRequest } from "./request";

type CurrentUserResponse = {
  user: {
    email: string;
    selectedCourses?: string[];
  };
};

export async function getCurrentUser(token: string): Promise<User> {
  const response = await apiRequest<CurrentUserResponse>("/users/me", {
    method: "GET",
    token,
  });

  return {
    email: response.user.email,
    selectedCourses: response.user.selectedCourses ?? [],
  };
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
