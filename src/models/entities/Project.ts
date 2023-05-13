import { ProjectStatus } from "../enum/ProjectStatus";
import { Team } from "./Team";

type Project = {
  _id: string;
  name: string;
  description?: string;
  techStack: string[];
  status: ProjectStatus;
  startDate: Date;
  endDate: Date;
  teamId: string;
  team: Team[];
  // columns: ColumnDocument[];
};

export { type Project };
