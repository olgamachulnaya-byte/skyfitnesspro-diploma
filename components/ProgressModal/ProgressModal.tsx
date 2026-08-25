"use client";

import { useEffect, useState } from "react";

import { getWorkoutProgress, updateWorkoutProgress } from "@/lib/api/progress";
import type { WorkoutProgress } from "@/types/progress";
import type { Exercise } from "@/types/workout";

import styles from "./ProgressModal.module.css";

type ProgressModalProps = {
  token: string;
  courseId: string;
  workoutId: string;
  exercises: Exercise[];
  initialValues: number[];
  onClose: () => void;
  onSaved: (progress: WorkoutProgress) => void;
};

function getExerciseName(name: string): string {
  return name.split("(")[0]?.trim() ?? name;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось сохранить прогресс";
}

export function ProgressModal({
  token,
  courseId,
  workoutId,
  exercises,
  initialValues,
  onClose,
  onSaved,
}: ProgressModalProps) {
  const [values, setValues] = useState<number[]>(initialValues);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

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

  function handleChange(index: number, value: string) {
    const nextValue = Number(value);

    setValues((currentValues) =>
      currentValues.map((currentValue, currentIndex) =>
        currentIndex === index
          ? Number.isNaN(nextValue)
            ? 0
            : Math.max(0, nextValue)
          : currentValue,
      ),
    );
  }

  async function handleSave() {
    try {
      setIsSaving(true);
      setErrorMessage("");

      await updateWorkoutProgress(token, courseId, workoutId, {
        progressData: values,
      });

      const updatedProgress = await getWorkoutProgress(
        token,
        courseId,
        workoutId,
      );

      onSaved(updatedProgress);
      onClose();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id="progress-modal-title" className={styles.title}>
          Мой прогресс
        </h2>

        <div className={styles.inputs}>
          {exercises.map((exercise, index) => (
            <label
              key={exercise._id ?? `${exercise.name}-${index}`}
              className={styles.field}
            >
              <span className={styles.label}>
                Сколько раз вы сделали{" "}
                {getExerciseName(exercise.name).toLowerCase()}? (из{" "}
                {exercise.quantity})
              </span>

              <input
                type="number"
                min={0}
                className={styles.input}
                value={values[index] ?? 0}
                onChange={(event) => handleChange(index, event.target.value)}
              />
            </label>
          ))}
        </div>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}

        <button
          type="button"
          className={styles.saveButton}
          disabled={isSaving}
          onClick={() => void handleSave()}
        >
          {isSaving ? "Сохранение..." : "Сохранить"}
        </button>
      </div>
    </div>
  );
}
