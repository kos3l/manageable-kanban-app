import { ProjectStatus } from "../enum/ProjectStatus";
import { Column } from "./Column";
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
  columns: Column[];
};

export { type Project };
