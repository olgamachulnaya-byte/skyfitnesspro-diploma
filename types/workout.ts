export type Exercise = {
  _id?: string;
  name: string;
  quantity: number;
};

export type Workout = {
  _id: string;
  name: string;
  video: string;
  exercises: Exercise[];
};