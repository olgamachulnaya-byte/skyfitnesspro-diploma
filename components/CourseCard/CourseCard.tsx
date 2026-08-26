"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { AuthModal } from "@/components/AuthModal/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { addCourseToUser } from "@/lib/api/users";
import type { Course } from "@/types/course";

import styles from "./CourseCard.module.css";

const courseImages: Record<string, string> = {
  Йога: "/figma/courses/yoga-card.svg",
  Стретчинг: "/figma/courses/stretching-card.svg",
  Фитнес: "/figma/courses/fitness-card.svg",
  "Степ-аэробика": "/figma/courses/step-aerobics-card.svg",
  Бодифлекс: "/figma/courses/bodyflex-card.svg",
};

type CourseCardProps = {
  course: Course;
};

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось добавить курс";
}

export function CourseCard({ course }: CourseCardProps) {
  const { token, user, isLoading, isAuthenticated, refreshUser } = useAuth();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const imageSrc = courseImages[course.nameRU];
  const hasCourse = user?.selectedCourses.includes(course._id) ?? false;

  async function handleAddCourse() {
    if (isLoading || isSubmitting || hasCourse) {
      return;
    }

    if (!isAuthenticated || !token || !user) {
      setIsAuthModalOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      await addCourseToUser(token, course._id);
      await refreshUser();
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.card}>
      <Link
        href={`/course/${course._id}`}
        className={styles.cardLink}
        aria-label={`Открыть курс ${course.nameRU}`}
      >
        <div className={styles.imageWrapper}>
          {imageSrc && (
            <Image
              src={imageSrc}
              alt={course.nameRU}
              width={360}
              height={325}
              className={styles.image}
              loading="eager"
              unoptimized
            />
          )}
        </div>

        <div className={styles.content}>
          <h2 className={styles.title}>{course.nameRU}</h2>

          <div className={styles.tags}>
            <div className={styles.tagRow}>
              <span className={styles.tag}>
                <Image
                  src="/figma/icons/calendar.svg"
                  alt=""
                  width={18}
                  height={18}
                />
                {course.durationInDays} дней
              </span>

              <span className={styles.tag}>
                <Image
                  src="/figma/icons/time.svg"
                  alt=""
                  width={18}
                  height={18}
                />
                {course.dailyDurationInMinutes.from}–
                {course.dailyDurationInMinutes.to} мин/день
              </span>
            </div>

            <span className={styles.tag}>
              <Image
                src="/figma/icons/difficulty.svg"
                alt=""
                width={18}
                height={18}
              />
              {course.difficulty}
            </span>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={styles.addIcon}
        onClick={handleAddCourse}
        disabled={isLoading || isSubmitting || hasCourse}
        aria-label={
          hasCourse
            ? `Курс ${course.nameRU} уже добавлен`
            : `Добавить курс ${course.nameRU}`
        }
      >
        <Image src="/figma/icons/add.svg" alt="" width={32} height={32} />
      </button>

      {errorMessage && <p className={styles.addError}>{errorMessage}</p>}

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
}
