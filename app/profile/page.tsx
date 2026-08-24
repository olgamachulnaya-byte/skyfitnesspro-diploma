"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkoutSelectModal } from "@/components/WorkoutSelectModal/WorkoutSelectModal";
import { Header } from "@/components/Header/Header";
import { ProfileCourseCard } from "@/components/ProfileCourseCard/ProfileCourseCard";
import { useAuth } from "@/hooks/useAuth";
import { getCourses } from "@/lib/api/courses";
import {
  getCourseProgress,
  resetCourseProgress,
} from "@/lib/api/progress";
import { removeCourseFromUser } from "@/lib/api/users";
import type { Course } from "@/types/course";
import type { CourseProgress } from "@/types/progress";

import styles from "./page.module.css";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла ошибка";
}

function calculateCourseProgress(
  course: Course,
  progress: CourseProgress,
): number {
  if (progress.courseCompleted) {
    return 100;
  }

  if (course.workouts.length === 0) {
    return 0;
  }

  const completedWorkouts =
    progress.workoutsProgress?.filter(
      (workout) => workout.workoutCompleted,
    ).length ?? 0;

  return Math.round(
    (completedWorkouts / course.workouts.length) * 100,
  );
}

export default function ProfilePage() {
  const router = useRouter();

  const {
    user,
    token,
    isLoading: isAuthLoading,
    isAuthenticated,
    logout,
    refreshUser,
  } = useAuth();

  const [courses, setCourses] = useState<Course[]>([]);
  const [courseProgress, setCourseProgress] = useState<
    Record<string, number>
  >({});
  const [isCoursesLoading, setIsCoursesLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [removingCourseId, setRemovingCourseId] = useState<
    string | null
  >(null);

  const [resettingCourseId, setResettingCourseId] = useState<
    string | null
  >(null);

  const [selectedCourse, setSelectedCourse] =
  useState<Course | null>(null);

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
      .filter((course) =>
        user.selectedCourses.includes(course._id),
      )
      .sort(
        (firstCourse, secondCourse) =>
          firstCourse.order - secondCourse.order,
      );
  }, [courses, user]);

  useEffect(() => {
    async function loadProgress() {
      if (!token || selectedCourses.length === 0) {
        return;
      }

      try {
        const progressEntries = await Promise.all(
          selectedCourses.map(async (course) => {
            const progress = await getCourseProgress(
              token,
              course._id,
            );

            return [
              course._id,
              calculateCourseProgress(course, progress),
            ] as const;
          }),
        );

        setCourseProgress(Object.fromEntries(progressEntries));
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      }
    }

    void loadProgress();
  }, [selectedCourses, token]);

  async function handleRemoveCourse(courseId: string) {
    if (!token) {
      return;
    }

    try {
      setErrorMessage("");
      setRemovingCourseId(courseId);

      await removeCourseFromUser(token, courseId);
      await refreshUser();

      setCourseProgress((currentProgress) => {
        const nextProgress = { ...currentProgress };

        delete nextProgress[courseId];

        return nextProgress;
      });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setRemovingCourseId(null);
    }
  }
   
   function handleOpenWorkoutModal(course: Course) {
  setSelectedCourse(course);
}

function handleCloseWorkoutModal() {
  setSelectedCourse(null);
}

function handleSelectWorkout(workoutId: string) {
  if (!selectedCourse) {
    return;
  }

  router.push(
    `/workout/${selectedCourse._id}/${workoutId}`,
  );
}

async function handleResetAndStart(course: Course) {
  if (!token) {
    return;
  }

  try {
    setErrorMessage("");
    setResettingCourseId(course._id);

    await resetCourseProgress(token, course._id);

    setCourseProgress((currentProgress) => ({
      ...currentProgress,
      [course._id]: 0,
    }));

    setSelectedCourse(course);
  } catch (error) {
    setErrorMessage(getErrorMessage(error));
  } finally {
    setResettingCourseId(null);
  }
}

  function handleLogout() {
    logout();
    router.push("/");
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
        <section className={styles.profileSection}>
          <h1 className={styles.title}>Профиль</h1>

          <div className={styles.profileCard}>
            <div className={styles.avatar} aria-hidden="true">
              <span className={styles.avatarLetter}>
                {user.email.charAt(0).toUpperCase()}
              </span>
            </div>

            <div className={styles.userInfo}>
              <p className={styles.userName}>
                {user.email.split("@")[0]}
              </p>

              <p className={styles.login}>
                Логин: {user.email}
              </p>

              <button
                type="button"
                className={styles.logoutButton}
                onClick={handleLogout}
              >
                Выйти
              </button>
            </div>
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
                <ProfileCourseCard
                  key={course._id}
                  course={course}
                  progress={courseProgress[course._id] ?? 0}
                  isRemoving={
                    removingCourseId === course._id
                  }
                  isResetting={
                    resettingCourseId === course._id
                  }
                  onStart={() =>
                     handleOpenWorkoutModal(course)
                  }
                  onResetAndStart={() =>
                     void handleResetAndStart(course)
                  }
                  onRemove={() =>
                    void handleRemoveCourse(course._id)
                  }
                />
              ))}
            </div>
          ) : (
            <p className={styles.empty}>
              У вас пока нет добавленных курсов.
            </p>
          )}
        </section>
      </main>
      
      {selectedCourse && token && (
      <WorkoutSelectModal
    token={token}
    courseId={selectedCourse._id}
    courseName={selectedCourse.nameRU}
    onClose={handleCloseWorkoutModal}
    onSelect={handleSelectWorkout}
      />
      )}  
    </div>
  );
}