import { User } from "./User";

type Task = {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  columnId: string;
  projectId: string;
  userIds: string[];
  createdAt: Date;
  users: User[];
  //   labels: string;
};

export { type Task };
