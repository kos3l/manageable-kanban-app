import { ProjectStatus } from "../enum/ProjectStatus";

type Project = {
  _id: string;
  name: string;
  description?: string;
  techStack: string[];
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  teamId: string;
  // columns: ColumnDocument[];
};

export { type Project };
