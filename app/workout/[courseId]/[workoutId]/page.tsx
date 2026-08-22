type WorkoutPageProps = {
  params: Promise<{
    courseId: string;
    workoutId: string;
  }>;
};

export default async function WorkoutPage({ params }: WorkoutPageProps) {
  const { courseId, workoutId } = await params;

  return (
    <main>
      <h1>Тренировка</h1>
      <p>Курс: {courseId}</p>
      <p>Тренировка: {workoutId}</p>
    </main>
  );
}