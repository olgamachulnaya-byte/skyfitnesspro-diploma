import Link from "next/link";

import type { Course } from "@/types/course";

import styles from "./CourseCard.module.css";

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <h2 className={styles.title}>{course.nameRU}</h2>

        <p className={styles.description}>{course.description}</p>

        <div className={styles.info}>
          <span>{course.durationInDays} дней</span>

          <span>
            {course.dailyDurationInMinutes.from}–
            {course.dailyDurationInMinutes.to} мин/день
          </span>

          <span>{course.difficulty}</span>
        </div>

        <Link
          href={`/course/${course._id}`}
          className={styles.link}
        >
          Подробнее
        </Link>
      </div>
    </article>
  );
}