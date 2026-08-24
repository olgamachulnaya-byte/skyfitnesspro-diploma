"use client";

import { useEffect, useState } from "react";

import { getCourseWorkouts } from "@/lib/api/courses";
import { getCourseProgress } from "@/lib/api/progress";
import type { Workout } from "@/types/workout";

import styles from "./WorkoutSelectModal.module.css";

type WorkoutSelectModalProps = {
  token: string;
  courseId: string;
  courseName: string;
  onClose: () => void;
  onSelect: (workoutId: string) => void;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось загрузить тренировки";
}

function getWorkoutDisplayData(
  workoutName: string,
  courseName: string,
  index: number,
) {
  const parts = workoutName
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    title: parts[0] ?? workoutName,
    description:
      parts.length >= 3
        ? `${parts[1]} / ${parts[2]}`
        : `${courseName} / ${index + 1} день`,
  };
}

export function WorkoutSelectModal({
  token,
  courseId,
  courseName,
  onClose,
  onSelect,
}: WorkoutSelectModalProps) {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [completedWorkoutIds, setCompletedWorkoutIds] = useState<
    Set<string>
  >(new Set());

  const [selectedWorkoutId, setSelectedWorkoutId] = useState<
    string | null
  >(null);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadWorkouts() {
      try {
        setErrorMessage("");

        const [workoutsData, progressData] = await Promise.all([
          getCourseWorkouts(token, courseId),
          getCourseProgress(token, courseId),
        ]);

        setWorkouts(workoutsData);

        const completedIds = new Set(
          progressData.workoutsProgress
            ?.filter((workout) => workout.workoutCompleted)
            .map((workout) => workout.workoutId) ?? [],
        );

        setCompletedWorkoutIds(completedIds);
        setSelectedWorkoutId(null);
        
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadWorkouts();
  }, [courseId, token]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  function handleStart() {
    if (!selectedWorkoutId) {
      return;
    }

    onSelect(selectedWorkoutId);
  }

  return (
    <div
      className={styles.backdrop}
      role="presentation"
      onMouseDown={onClose}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workout-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2
          id="workout-modal-title"
          className={styles.title}
        >
          Выберите тренировку
        </h2>

        {isLoading && (
          <p className={styles.message}>Загрузка...</p>
        )}

        {errorMessage && (
          <p className={styles.error}>{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && (
          <div className={styles.list}>
            {workouts.map((workout, index) => {
              const isCompleted =
                completedWorkoutIds.has(workout._id);

              const isSelected =
                selectedWorkoutId === workout._id;

              const displayData = getWorkoutDisplayData(
                workout.name,
                courseName,
                index,
              );

              return (
                <button
                  key={workout._id}
                  type="button"
                  className={styles.workout}
                  onClick={() =>
                    setSelectedWorkoutId(workout._id)
                  }
                >
                  <span
                    className={`${styles.radio} ${
                      isSelected ? styles.radioSelected : ""
                    } ${
                      isCompleted
                        ? styles.radioCompleted
                        : ""
                    }`}
                    aria-hidden="true"
                  >
                    {isCompleted ? "✓" : ""}
                  </span>

                  <span className={styles.workoutInfo}>
                    <span className={styles.workoutName}>
                      {displayData.title}
                    </span>

                    <span
                      className={styles.workoutDescription}
                    >
                      {displayData.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className={styles.startButton}
          disabled={
            !selectedWorkoutId ||
            isLoading ||
            Boolean(errorMessage)
          }
          onClick={handleStart}
        >
          Начать
        </button>
      </div>
    </div>
  );
}