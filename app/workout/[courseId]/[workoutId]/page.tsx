"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Header } from "@/components/Header/Header";
import { ProgressModal } from "@/components/ProgressModal/ProgressModal";
import { ProgressSuccessModal } from "@/components/ProgressSuccessModal/ProgressSuccessModal";
import { ResetProgressModal } from "@/components/ResetProgressModal/ResetProgressModal";
import { useAuth } from "@/hooks/useAuth";
import { getCourseById } from "@/lib/api/courses";
import { getWorkoutProgress, resetWorkoutProgress } from "@/lib/api/progress";
import { getWorkoutById } from "@/lib/api/workouts";
import type { Course } from "@/types/course";
import type { WorkoutProgress } from "@/types/progress";
import type { Workout } from "@/types/workout";

import styles from "./page.module.css";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Произошла ошибка";
}

function getExerciseName(name: string): string {
  return name.split("(")[0]?.trim() ?? name;
}

function calculateProgress(currentValue: number, targetValue: number): number {
  if (targetValue <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((currentValue / targetValue) * 100));
}

export default function WorkoutPage() {
  const router = useRouter();

  const params = useParams<{
    courseId: string;
    workoutId: string;
  }>();

  const { token, isLoading: isAuthLoading, isAuthenticated } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);

  const [progress, setProgress] = useState<WorkoutProgress | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthLoading, isAuthenticated, router]);

  useEffect(() => {
    async function loadWorkout() {
      if (!token || !params.courseId || !params.workoutId) {
        return;
      }

      try {
        setErrorMessage("");

        const [courseData, workoutData, progressData] = await Promise.all([
          getCourseById(params.courseId),
          getWorkoutById(token, params.workoutId),
          getWorkoutProgress(token, params.courseId, params.workoutId),
        ]);

        setCourse(courseData);
        setWorkout(workoutData);
        setProgress(progressData);
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    if (isAuthenticated) {
      void loadWorkout();
    }
  }, [isAuthenticated, params.courseId, params.workoutId, token]);

  async function handleResetWorkout() {
    if (!token) {
      return;
    }

    try {
      setIsResetting(true);
      setActionError("");

      await resetWorkoutProgress(token, params.courseId, params.workoutId);

      const updatedProgress = await getWorkoutProgress(
        token,
        params.courseId,
        params.workoutId,
      );

      setProgress(updatedProgress);
      setIsResetModalOpen(false);
    } catch (error) {
      setActionError(getErrorMessage(error));
    } finally {
      setIsResetting(false);
    }
  }

  if (isAuthLoading || isLoading) {
    return (
      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          <p className={styles.message}>Загрузка...</p>
        </main>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className={styles.page}>
        <Header />

        <main className={styles.main}>
          <p className={styles.error}>{errorMessage}</p>
        </main>
      </div>
    );
  }

  if (!course || !workout || !token) {
    return null;
  }

  const progressData = progress?.progressData ?? workout.exercises.map(() => 0);

  const workoutCompleted = progress?.workoutCompleted ?? false;

  function handleProgressButton() {
    if (workoutCompleted) {
      setIsResetModalOpen(true);
      return;
    }

    setIsProgressModalOpen(true);
  }

  function handleProgressSaved(updatedProgress: WorkoutProgress) {
    setProgress(updatedProgress);
    setIsSuccessModalOpen(true);
  }

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <h1 className={styles.title}>{course.nameRU}</h1>

        <div className={styles.videoWrapper}>
          <iframe
            className={styles.video}
            src={workout.video}
            title={workout.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <section className={styles.exerciseSection}>
          <h2 className={styles.exerciseTitle}>Упражнения тренировки</h2>

          <div className={styles.exerciseGrid}>
            {workout.exercises.map((exercise, index) => {
              const currentValue = progressData[index] ?? 0;

              const percent = calculateProgress(
                currentValue,
                exercise.quantity,
              );

              return (
                <div
                  key={exercise._id ?? `${exercise.name}-${index}`}
                  className={styles.exercise}
                >
                  <p className={styles.exerciseName}>
                    {getExerciseName(exercise.name)} {percent}%
                  </p>

                  <div
                    className={styles.progressTrack}
                    role="progressbar"
                    aria-label={`Прогресс упражнения ${getExerciseName(
                      exercise.name,
                    )}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percent}
                  >
                    <div
                      className={styles.progressValue}
                      style={{
                        width: `${percent}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {actionError && <p className={styles.error}>{actionError}</p>}

          <button
            type="button"
            className={styles.progressButton}
            onClick={handleProgressButton}
          >
            {workoutCompleted
              ? "Сбросить прогресс тренировки"
              : progress?.progressData
                ? "Обновить свой прогресс"
                : "Заполнить свой прогресс"}
          </button>
        </section>
      </main>

      {isProgressModalOpen && (
        <ProgressModal
          token={token}
          courseId={params.courseId}
          workoutId={params.workoutId}
          exercises={workout.exercises}
          initialValues={progressData}
          onClose={() => setIsProgressModalOpen(false)}
          onSaved={handleProgressSaved}
        />
      )}

      {isSuccessModalOpen && (
        <ProgressSuccessModal onClose={() => setIsSuccessModalOpen(false)} />
      )}

      {isResetModalOpen && (
        <ResetProgressModal
          isResetting={isResetting}
          onClose={() => setIsResetModalOpen(false)}
          onConfirm={() => void handleResetWorkout()}
        />
      )}
    </div>
  );
}
