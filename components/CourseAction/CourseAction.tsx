"use client";

import { useState } from "react";

import { AuthModal } from "@/components/AuthModal/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { addCourseToUser } from "@/lib/api/users";

import styles from "./CourseAction.module.css";

type CourseActionProps = {
  courseId: string;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось добавить курс";
}

export function CourseAction({ courseId }: CourseActionProps) {
  const { token, user, isLoading, isAuthenticated, refreshUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const hasCourse = user?.selectedCourses.includes(courseId) ?? false;

  async function handleClick() {
    if (isLoading || isSubmitting) {
      return;
    }

    if (!isAuthenticated || !token || !user) {
      setIsAuthModalOpen(true);
      return;
    }

    if (hasCourse) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await addCourseToUser(token, courseId);
      await refreshUser();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  let buttonText = "Войдите, чтобы добавить курс";

  if (isLoading) {
    buttonText = "Загрузка...";
  } else if (isAuthenticated && hasCourse) {
    buttonText = "Курс уже добавлен";
  } else if (isAuthenticated && isSubmitting) {
    buttonText = "Добавляем...";
  } else if (isAuthenticated) {
    buttonText = "Добавить курс";
  }

  return (
    <>
      <div className={styles.wrapper}>
        <button
          type="button"
          className={styles.button}
          onClick={handleClick}
          disabled={isLoading || isSubmitting || hasCourse}
        >
          {buttonText}
        </button>

        {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}
