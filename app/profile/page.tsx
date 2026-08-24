"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { Header } from "@/components/Header/Header";
import { getCourses } from "@/lib/api/courses";
import { removeCourseFromUser } from "@/lib/api/users";
import { useAuth } from "@/hooks/useAuth";
import type { Course } from "@/types/course";

import styles from "./page.module.css";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла ошибка";
}

export default function ProfilePage() {
  const router = useRouter();

  const {
    user,
    token,
    isLoading: isAuthLoading,
    isAuthenticated,
    refreshUser,
  } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [removingCourseId, setRemovingCourseId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadCourses() {
      if (!isAuthenticated) {
        return;
      }

      try {
        setErrorMessage("");

        const coursesData = await getCourses();

        setCourses(coursesData);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsCoursesLoading(false);
      }
    }

    void loadCourses();
  }, [isAuthenticated]);

  const selectedCourses = useMemo(() => {
    if (!user) {
      return [];
    }

    return courses
      .filter((course) => user.selectedCourses.includes(course._id))
      .sort(
        (firstCourse, secondCourse) =>
          firstCourse.order - secondCourse.order,
      );
  }, [courses, user]);

  async function handleRemoveCourse(courseId: string) {
    if (!token) {
      return;
    }

    try {
      setErrorMessage("");
      setRemovingCourseId(courseId);

      await removeCourseFromUser(token, courseId);
      await refreshUser();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setRemovingCourseId(null);
    }
  }

  function handleStartWorkout(courseId: string) {
    router.push(`/course/${courseId}`);
  }

  if (isAuthLoading || isCoursesLoading) {
    return (
      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          <p className={styles.message}>Загрузка...</p>
        </main>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <section className={styles.profile}>
          <h1 className={styles.title}>Мой профиль</h1>

          <div className={styles.userInfo}>
            <p>
              <span className={styles.label}>Логин:</span>{" "}
              {user.email}
            </p>
          </div>
        </section>

        <section className={styles.coursesSection}>
          <h2 className={styles.coursesTitle}>Мои курсы</h2>

          {errorMessage && (
            <p className={styles.error}>{errorMessage}</p>
          )}

          {selectedCourses.length > 0 ? (
            <div className={styles.coursesGrid}>
              {selectedCourses.map((course) => (
                <article
                  key={course._id}
                  className={styles.courseCard}
                >
                  <h3 className={styles.courseName}>
                    {course.nameRU}
                  </h3>

                  <p className={styles.courseDescription}>
                    {course.description}
                  </p>

                  <div className={styles.actions}>
                    <button
                      type="button"
                      className={styles.primaryButton}
                      onClick={() =>
                        handleStartWorkout(course._id)
                      }
                    >
                      Начать тренировку
                    </button>

                    <button
                      type="button"
                      className={styles.secondaryButton}
                      disabled={removingCourseId === course._id}
                      onClick={() =>
                        void handleRemoveCourse(course._id)
                      }
                    >
                      {removingCourseId === course._id
                        ? "Удаление..."
                        : "Удалить курс"}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              У вас пока нет добавленных курсов.
            </p>
          )}
        </section>
      </main>
    </div>
  );
}