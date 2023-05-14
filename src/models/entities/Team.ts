import { Project } from "./Project";
import { User } from "./User";

type Team = {
  _id: string;
  name: string;
  createdBy: string;
  description?: string;
  picture?: string;
  users: string[];
  projects?: string[];
  createdAt: Date;
  userModels?: User[];
  projectModels: Project[];
};

export { type Team };
