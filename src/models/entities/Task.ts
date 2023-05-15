type Task = {
  _id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  columnId: string;
  projectId: string;
  userIds: string[];
  //   labels: string;
};

export { type Task };
