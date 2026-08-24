import Image from "next/image";

import type { Course } from "@/types/course";

import styles from "./ProfileCourseCard.module.css";

const courseImages: Record<string, string> = {
  Йога: "/figma/courses/yoga.png",
  Стретчинг: "/figma/courses/stretching.png",
  Фитнес: "/figma/courses/fitness.png",
  "Степ-аэробика": "/figma/courses/step-aerobics.png",
  Бодифлекс: "/figma/courses/bodyflex.png",
};

type ProfileCourseCardProps = {
  course: Course;
  progress: number;
  isRemoving: boolean;
  isResetting: boolean;
  onStart: () => void;
  onRemove: () => void;
  onResetAndStart: () => void;
};

export function ProfileCourseCard({
  course,
  progress,
  isRemoving,
  isResetting,
  onStart,
  onRemove,
  onResetAndStart,
}: ProfileCourseCardProps) {
  const imageSrc = courseImages[course.nameRU];

  const buttonText =
    progress >= 100
      ? "Начать заново"
      : progress > 0
        ? "Продолжить"
        : "Начать тренировку";

  function handleMainAction() {
    if (progress >= 100) {
      onResetAndStart();
      return;
    }

    onStart();
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrapper}>
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={course.nameRU}
            width={360}
            height={325}
            className={styles.image}
          />
        )}

        <button
          type="button"
          className={styles.removeButton}
          onClick={onRemove}
          disabled={isRemoving}
          aria-label={`Удалить курс ${course.nameRU}`}
          title="Удалить курс"
        >
          <span aria-hidden="true">−</span>
        </button>
      </div>

      <div className={styles.content}>
        <h3 className={styles.title}>{course.nameRU}</h3>

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

        <div className={styles.progressBlock}>
          <span className={styles.progressText}>
            Прогресс: {progress}%
          </span>

          <div
            className={styles.progressTrack}
            role="progressbar"
            aria-label={`Прогресс курса ${course.nameRU}`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className={styles.progressValue}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          type="button"
          className={styles.mainButton}
          onClick={handleMainAction}
          disabled={isResetting}
        >
          {isResetting ? "Сброс..." : buttonText}
        </button>
      </div>
    </article>
  );
}