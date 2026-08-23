import Image from "next/image";

import type { Course } from "@/types/course";

import { CourseAction } from "../CourseAction/CourseAction";

import styles from "./CourseDetails.module.css";

const courseHeroImages: Record<string, string> = {
  Йога: "/figma/course/yoga-hero-figma.png",
  Стретчинг: "/figma/courses/stretching.png",
  Фитнес: "/figma/courses/fitness.png",
  "Степ-аэробика": "/figma/courses/step-aerobics.png",
  Бодифлекс: "/figma/courses/bodyflex.png",
};

const courseMobileHeroImages: Record<string, string> = {
  Йога: "/figma/courses/yoga.png",
  Стретчинг: "/figma/courses/stretching.png",
  Фитнес: "/figma/courses/fitness.png",
  "Степ-аэробика": "/figma/courses/step-aerobics.png",
  Бодифлекс: "/figma/courses/bodyflex.png",
};

const yogaBenefits = [
  "проработка всех групп мышц",
  "тренировка суставов",
  "улучшение циркуляции крови",
  "упражнения заряжают бодростью",
  "помогают противостоять стрессам",
];

const yogaDirectionsOrder = [
  "Йога для новичков",
  "Классическая йога",
  "Кундалини-йога",
  "Йогатерапия",
  "Хатха-йога",
  "Аштанга-йога",
];

type CourseDetailsProps = {
  course: Course;
};

export function CourseDetails({ course }: CourseDetailsProps) {
  const heroImage =
    courseHeroImages[course.nameRU] ?? "/figma/courses/yoga.png";

  const mobileHeroImage =
    courseMobileHeroImages[course.nameRU] ?? heroImage;

  const fittingItems = course.fitting.slice(0, 3);

  const directions =
    course.nameRU === "Йога"
      ? yogaDirectionsOrder.filter((direction) =>
          course.directions.includes(direction),
        )
      : course.directions.slice(0, 6);

  const benefits =
    course.nameRU === "Йога"
      ? yogaBenefits
      : course.directions.slice(0, 5);

  return (
    <div className={styles.wrapper}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>{course.nameRU}</h1>

        <Image
          src={heroImage}
          alt=""
          width={1023}
          height={683}
          className={styles.heroImageDesktop}
          priority
        />

        <Image
          src={mobileHeroImage}
          alt={course.nameRU}
          fill
          sizes="(max-width: 600px) 343px, 1px"
          className={styles.heroImageMobile}
          priority
        />
      </section>

      <section className={styles.fittingSection}>
        <h2 className={styles.sectionTitle}>
          Подойдет для вас, если:
        </h2>

        <div className={styles.fittingGrid}>
          {fittingItems.map((item, index) => (
            <article
              key={item}
              className={styles.fittingCard}
            >
              <span className={styles.fittingNumber}>
                {index + 1}
              </span>

              <p className={styles.fittingText}>{item}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.directionsSection}>
        <h2 className={styles.sectionTitle}>Направления</h2>

        <div className={styles.directionsBox}>
          {directions.map((direction) => (
            <div
              key={direction}
              className={styles.direction}
            >
              <Image
                src="/figma/course/sparkle.svg"
                alt=""
                width={26}
                height={26}
                className={styles.sparkle}
              />

              <span>{direction}</span>
            </div>
          ))}
        </div>
      </section>

     <section className={styles.cta}>
  <div className={styles.ctaDecoration} aria-hidden="true">
    <Image
      src="/figma/course/cta-line-green.svg"
      alt=""
      width={375}
      height={290}
      className={styles.ctaLineGreen}
    />

    <Image
      src="/figma/course/cta-line-black.svg"
      alt=""
      width={37}
      height={32}
      className={styles.ctaLineBlack}
    />
  </div>

  <Image
    src="/figma/course/cta-athlete.png"
    alt=""
    width={487}
    height={542}
    className={styles.ctaAthlete}
  />

  <div className={styles.ctaContent}>
    <h2 className={styles.ctaTitle}>
      Начните путь
      <br />
      к новому телу
    </h2>

    <ul className={styles.benefits}>
      {benefits.map((benefit) => (
        <li key={benefit}>{benefit}</li>
      ))}
    </ul>

    <CourseAction courseId={course._id} />
  </div>
</section>
    </div>
  );
}