export type CourseDifficulty = "начальный" | "средний" | "сложный";

export type DailyDuration = {
  from: number;
  to: number;
};

export type Course = {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  order: number;
  difficulty: CourseDifficulty;
  durationInDays: number;
  dailyDurationInMinutes: DailyDuration;
  workouts: string[];
};
