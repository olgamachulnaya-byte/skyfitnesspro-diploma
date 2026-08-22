"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/hooks/useAuth";

export default function ProfilePage() {
  const router = useRouter();

  const { user, isLoading, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  function handleLogout() {
    logout();
    router.push("/");
  }

  if (isLoading) {
    return (
      <main>
        <p>Загрузка...</p>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main>
      <h1>Мой профиль</h1>

      <p>Email: {user.email}</p>

      <h2>Мои курсы</h2>

      {user.selectedCourses.length > 0 ? (
        <ul>
          {user.selectedCourses.map((courseId) => (
            <li key={courseId}>{courseId}</li>
          ))}
        </ul>
      ) : (
        <p>У вас пока нет добавленных курсов.</p>
      )}

      <button type="button" onClick={handleLogout}>
        Выйти
      </button>
    </main>
  );
}