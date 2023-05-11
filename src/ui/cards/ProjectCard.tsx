import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Project } from "../../models/entities/Project";
import { ProjectStatus } from "../../models/enum/ProjectStatus";
import { ProjectStatusText } from "../../models/enum/ProjectStatusText";
import { colorIndex } from "../../models/util/ColorIndex";

interface IProps {
  project: Project;
  icon: ReactNode;
}

type colorVariants = {
  COMPLETED: string;
  ONGOING: string;
  NOTSTARTED: string;
  OVERDUE: string;
};

export default function ProjectCard(props: IProps) {
  const { icon, project } = props;

  const labelVariants: colorIndex & colorVariants = {
    COMPLETED:
      "rounded border border-indigo-500 bg-indigo-700/20 px-2 py-0.5 text-indigo-500",
    ONGOING:
      "rounded border border-pink-500 bg-pink-800/20 px-2 py-0.5 text-pink-400",
    NOTSTARTED:
      "rounded border border-neutral-400 bg-neutral-500/20 px-2 py-0.5 text-neutral-300",
    OVERDUE:
      "rounded border border-red-700 bg-red-800/20 px-2 py-0.5 text-red-700",
  };

  return (
    <Link to={"../projects/" + project._id}>
      <div
        key={project._id}
        className="hover:transitio flex h-28 w-full flex-col justify-between overflow-scroll rounded-lg border border-neutral-600 bg-neutral-800/50  p-3 hover:border-neutral-400"
      >
        <div className="flex w-full items-center gap-2">
          <div className={"flex h-6 w-6 items-center justify-center"}>
            {icon}
          </div>
          <div className={`${labelVariants[ProjectStatus[project.status]]}`}>
            <p className="mt-0.5 truncate text-xs font-semibold tracking-wider ">
              {
                ProjectStatusText[
                  ProjectStatus[
                    project.status
                  ] as keyof typeof ProjectStatusText
                ]
              }
            </p>
          </div>
        </div>

        <div className="flex-co flex h-max w-full">
          <p className="truncate font-serif text-lg leading-5 tracking-widest">
            <span className="truncate font-sans text-base tracking-normal text-neutral-500">
              {project.team[0].name}
            </span>
            <br />
            {project.name}
          </p>
        </div>
      </div>
    </Link>
  );
}
