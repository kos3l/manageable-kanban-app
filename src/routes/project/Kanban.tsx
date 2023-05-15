import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useRouteLoaderData } from "react-router-dom";
import { Project } from "../../models/entities/Project";
import FilledButton from "../../ui/buttons/FilledButton";
import TaskWrapperCard from "../../ui/cards/TaskWrapperCard";

export default function KanbanPage() {
  const project = useRouteLoaderData("selectedProject") as Project;

  if (!project) {
    return <>Loading</>;
  }

  return (
    <div className="relative flex h-full w-full overflow-scroll">
      <div className="absolute flex h-full w-max justify-center gap-3 md:justify-start 2xl:justify-center">
        {project.columns.map((col, index) => {
          return (
            <div key={index} className="flex h-full w-72">
              <TaskWrapperCard column={col}></TaskWrapperCard>
            </div>
          );
        })}
        <div className="flex h-full w-72 flex-col gap-2 overflow-scroll ">
          <FilledButton
            content={"Add Column"}
            icon={<PlusIcon className="w-5 text-neutral-300"></PlusIcon>}
            removeBackground
          ></FilledButton>
        </div>
      </div>
    </div>
  );
}
