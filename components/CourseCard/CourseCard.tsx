import Image from "next/image";
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
          <Image
            src={imageSrc}
            alt={course.nameRU}
            width={360}
            height={325}
            className={styles.image}
          />
        )}

        <span className={styles.addIcon} aria-hidden="true">
          <Image
            src="/figma/icons/add.svg"
            alt=""
            width={32}
            height={32}
          />
        </span>
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
  );
}