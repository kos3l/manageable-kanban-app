import {
  CheckCircleIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { QueryClient } from "react-query";
import { redirect, useRouteLoaderData } from "react-router-dom";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { Project } from "../../models/entities/Project";
import { Task } from "../../models/entities/Task";
import FilledButton from "../../ui/buttons/FilledButton";
import ColumnWrapperCard from "../../ui/cards/ColumnWrapperCard";
import DisplayField from "../../ui/display-field/DisplayField";

export default function KanbanPage() {
  const project = useRouteLoaderData("selectedProject") as Project;

  if (!project) {
    return <>Loading</>;
  }

  return (
    <div className="relative flex h-full w-full overflow-scroll">
      <div className="flex h-16 w-max items-center gap-3 rounded-lg border border-neutral-600 bg-neutral-800/20 p-2 pr-4">
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
            label={"Start Date"}
            placeholder={"Date not found"}
            value={new Date(project.startDate).toLocaleDateString()}
            icon={<ClockIcon className="w-6 text-neutral-300"></ClockIcon>}
          ></DisplayField>
          <DisplayField
            label={"End Date"}
            placeholder={"Date not found"}
            icon={
              <CheckCircleIcon className="w-6 text-neutral-300"></CheckCircleIcon>
            }
            value={new Date(project.endDate).toLocaleDateString()}
          ></DisplayField>
        </div>
      </div>
      <div className="absolute top-20 flex h-[calc(100%-5rem)] w-max justify-center gap-3  md:justify-start 2xl:justify-center">
        {project.columns.map((col, index) => {
          return (
            <div key={index} className="flex h-full w-72">
              <ColumnWrapperCard column={col}></ColumnWrapperCard>
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
