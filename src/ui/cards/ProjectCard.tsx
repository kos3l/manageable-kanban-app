import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../models/entities/Project";

interface IProps {
  project: Project;
  icon: ReactNode;
}

export default function ProjectCard(props: IProps) {
  const { icon, project } = props;

  return (
    <Link to={"../projects/" + project._id}>
      <div
        key={project._id}
        className="flex h-20 w-full flex-col justify-between rounded-lg border border-neutral-600 bg-neutral-800/50 p-2"
      >
        <div className={"flex h-6 w-6 items-center justify-center"}>{icon}</div>
        <p className="truncate font-serif text-base tracking-widest">
          {project.name}
        </p>
      </div>
    </Link>
  );
}
