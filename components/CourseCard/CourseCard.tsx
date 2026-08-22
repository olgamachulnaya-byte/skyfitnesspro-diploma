import Link from "next/link";

import type { Course } from "@/types/course";

import styles from "./CourseCard.module.css";

const courseImages: Record<string, string> = {
  Йога: "/figma/courses/yoga.png",
  Стретчинг: "/figma/courses/stretching.png",
  Фитнес: "/figma/courses/fitness.png",
  "Степ-аэробика": "/figma/courses/step-aerobics.png",
  Бодифлекс: "/figma/courses/bodyflex.png",
};

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const imageSrc = courseImages[course.nameRU];

  return (
    <Link
      href={`/course/${course._id}`}
      className={styles.card}
      aria-label={`Открыть курс ${course.nameRU}`}
    >
      <div className={styles.imageWrapper}>
        {imageSrc && (
          <img
            src={imageSrc}
            alt={course.nameRU}
            className={styles.image}
          />
        )}

        <span className={styles.addIcon} aria-hidden="true">
          <img src="/figma/icons/add.svg" alt="" />
        </span>
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>{course.nameRU}</h2>

        <div className={styles.tags}>
          <div className={styles.tagRow}>
            <span className={styles.tag}>
              <img src="/figma/icons/calendar.svg" alt="" />
              {course.durationInDays} дней
            </span>

            <span className={styles.tag}>
              <img src="/figma/icons/time.svg" alt="" />
              {course.dailyDurationInMinutes.from}–
              {course.dailyDurationInMinutes.to} мин/день
            </span>
          </div>

          <span className={styles.tag}>
            <img src="/figma/icons/difficulty.svg" alt="" />
            {course.difficulty}
          </span>
        </div>
      </div>
    </Link>
  );
}