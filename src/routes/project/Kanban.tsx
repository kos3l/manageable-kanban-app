import {
  BellAlertIcon,
  BellIcon,
  CheckCircleIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  PencilSquareIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { QueryClient } from "react-query";
import { Link, redirect, useRouteLoaderData } from "react-router-dom";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { Project } from "../../models/entities/Project";
import { Task } from "../../models/entities/Task";
import FilledButton from "../../ui/buttons/FilledButton";
import ColumnWrapperCard from "../../ui/cards/ColumnWrapperCard";
import SelectedTaskCard from "../../ui/cards/SelectedTaskCard";
import UserCard from "../../ui/cards/UserCard";
import DisplayField from "../../ui/display-field/DisplayField";

export default function KanbanPage() {
  const project = useRouteLoaderData("selectedProject") as Project;
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  if (!project) {
    return <>Loading</>;
  }

  return (
    <div
      className={
        selectedTask
          ? "relative flex h-full w-full overflow-hidden py-3"
          : "relative flex h-full w-full overflow-scroll py-3"
      }
    >
      <div className="ml-3 flex h-14 w-max items-center gap-3 rounded-lg border border-neutral-600 bg-neutral-800/20 p-2 pr-4">
        <div className="mr-40 w-max">
          <h1 className="truncate font-serif text-lg leading-5 tracking-widest">
            <span className="truncate font-sans text-sm tracking-normal text-neutral-500">
              {project.team[0].name ? project.team[0].name : ""}
            </span>
            <br />
            {project.name}
          </h1>
        </div>
        <div className="flex w-max gap-6">
          <DisplayField
            color="white"
            label={"Start Date"}
            placeholder={"Date not found"}
            value={new Date(project.startDate).toLocaleDateString()}
            icon={<ClockIcon className="w-6 text-neutral-300"></ClockIcon>}
          ></DisplayField>
          <DisplayField
            color="white"
            label={"End Date"}
            placeholder={"Date not found"}
            icon={
              <CheckCircleIcon className="w-6 text-neutral-300"></CheckCircleIcon>
            }
            value={new Date(project.endDate).toLocaleDateString()}
          ></DisplayField>
        </div>
      </div>

      <div className="absolute top-20 flex h-[calc(100%-5rem)] w-max justify-center gap-4 overflow-scroll pl-3 pb-3  md:justify-start 2xl:justify-center">
        {project.columns.map((col, index) => {
          return (
            <div key={index} className="flex h-full w-72">
              <ColumnWrapperCard
                project={project}
                column={col}
                taskClicked={(task) => setSelectedTask(task)}
              ></ColumnWrapperCard>
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

      {selectedTask !== null ? (
        <div className="absolute top-0 flex h-full w-full justify-start bg-neutral-900/90 pl-4 pt-4">
          <SelectedTaskCard
            selectedTask={selectedTask}
            onClose={() => setSelectedTask(null)}
          ></SelectedTaskCard>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
