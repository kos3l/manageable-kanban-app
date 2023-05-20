import { BellAlertIcon } from "@heroicons/react/24/solid";
import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../models/entities/Project";
import { ProjectStatus } from "../../models/enum/ProjectStatus";
import { ProjectStatusText } from "../../models/enum/ProjectStatusText";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  project: Project;
  teamName?: string;
  icon: ReactNode;
}

export default function KanbanCard(props: IProps) {
  const { icon, project, teamName } = props;

  if (!project) {
    return <>Loading</>;
  }

  const totalTasks: number =
    project.columns && project.columns.length > 0
      ? project.columns.reduce((acc, val) => {
          const lenght: number = val.tasks.length;
          return acc + lenght;
        }, 0)
      : 0;

  return (
    <Link to={"../projects/" + project._id + "/kanban"}>
      <div
        key={project._id}
        className="hover:transitio flex h-28 w-full flex-col justify-between overflow-scroll rounded-lg border border-neutral-600 bg-neutral-800/50 p-3 transition hover:border-neutral-400"
      >
        <div className="flex w-full items-center justify-between gap-2">
          <div className="flex w-max items-center gap-1">
            <div className={"flex h-6 w-6 items-center justify-center"}>
              {icon}
            </div>
            <p className=" font-serif text-sm tracking-wider">{totalTasks}</p>
          </div>
          <div className="flex w-max items-center gap-2">
            <p className="mt-1 opacity-80">
              {new Date(project.endDate).toLocaleDateString(undefined, {
                month: "numeric",
                day: "numeric",
              })}
            </p>
            <div
              className={
                "flex h-6 w-6 items-center justify-center rounded bg-neutral-700"
              }
            >
              <BellAlertIcon className="w-4 text-neutral-300"></BellAlertIcon>
            </div>
          </div>
        </div>
        <div className="flex-co flex h-max w-full">
          <p className="truncate font-serif text-lg leading-5 tracking-widest">
            <span className="truncate font-sans text-base tracking-normal text-neutral-500">
              {teamName ? teamName : project.team[0].name}
            </span>
            <br />
            {project.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
