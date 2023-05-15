import { Task } from "./Task";

type Column = {
  _id: string;
  name: string;
  order: number;
  tasks: Task[];
};

export { type Column };
