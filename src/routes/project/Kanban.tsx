import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/solid";
import { useRouteLoaderData } from "react-router-dom";
import { Project } from "../../models/entities/Project";
import FilledButton from "../../ui/buttons/FilledButton";

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
            <div
              key={index}
              className="flex h-full w-72 flex-col gap-2 overflow-scroll "
            >
              <div className="flex h-12 w-full items-center justify-between rounded-lg border border-neutral-600 px-3">
                <p className="neutral-500 font-serif text-base tracking-wider">
                  {col.name + " | "}
                </p>
                <div className="flex h-7 w-7 cursor-pointer items-center justify-center">
                  <EllipsisHorizontalIcon></EllipsisHorizontalIcon>
                </div>
              </div>
              <FilledButton
                content={"New Task"}
                removeBackground={false}
                icon={<PlusIcon className="w-5 text-neutral-300"></PlusIcon>}
              ></FilledButton>
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
