import { notFound } from "next/navigation";

import { CourseDetails } from "@/components/CourseDetails/CourseDetails";
import { Header } from "@/components/Header/Header";
import { getCourseById } from "@/lib/api/courses";
import { ApiRequestError } from "@/lib/api/request";
import type { Course } from "@/types/course";

import styles from "./page.module.css";

type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

async function loadCourse(courseId: string): Promise<Course> {
  try {
    return await getCourseById(courseId);
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      error.status === 404
    ) {
      notFound();
    }

    throw error;
  }
}

export default async function CoursePage({
  params,
}: CoursePageProps) {
  const { courseId } = await params;

  const course = await loadCourse(courseId);

  return (
    <div className={styles.page}>
      <Header />

      <main className={styles.main}>
        <CourseDetails course={course} />
      </main>
    </div>
  );
}