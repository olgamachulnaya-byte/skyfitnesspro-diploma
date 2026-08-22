type CoursePageProps = {
  params: Promise<{
    courseId: string;
  }>;
};

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = await params;

  return (
    <main>
      <h1>Страница курса</h1>
      <p>Идентификатор курса: {courseId}</p>
    </main>
  );
}