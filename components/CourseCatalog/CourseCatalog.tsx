"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { getCourses } from "@/lib/api/courses";
import type { Course } from "@/types/course";

import { CourseCard } from "../CourseCard/CourseCard";

import styles from "./CourseCatalog.module.css";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Не удалось загрузить курсы";
}

export function CourseCatalog() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadCourses() {
      try {
        setErrorMessage("");

        const coursesData = await getCourses();

        setCourses(
          [...coursesData].sort(
            (firstCourse, secondCourse) =>
              firstCourse.order - secondCourse.order,
          ),
        );
      } catch (error) {
        setErrorMessage(getErrorMessage(error));
      } finally {
        setIsLoading(false);
      }
    }

    void loadCourses();
  }, []);

  if (isLoading) {
    return <p className={styles.message}>Загрузка курсов...</p>;
  }

  if (errorMessage) {
    return <p className={styles.error}>{errorMessage}</p>;
  }

  return (
    <section className={styles.section}>
      <div className={styles.hero}>
        <h1 className={styles.title}>
          <span className={styles.titleDesktop}>
            Начните заниматься спортом
            <br />и улучшите качество жизни
          </span>

          <span className={styles.titleMobile}>
            Начните заниматься
            <br />
            спортом и улучшите
            <br />
            качество жизни
          </span>
        </h1>

        <div className={styles.callout}>
          <span>
            Измени своё
            <br />
            тело за полгода!
          </span>

          <Image
            src="/figma/icons/bubble-tail.svg"
            alt=""
            width={31}
            height={36}
            className={styles.calloutTail}
          />
        </div>
      </div>

      <div className={styles.grid}>
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </section>
  );
}
