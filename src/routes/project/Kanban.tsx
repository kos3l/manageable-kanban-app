import {
  CheckCircleIcon,
  ClockIcon,
  Cog6ToothIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useRef, useState } from "react";
import Draggable, { ControlPosition } from "react-draggable";
import { QueryClient } from "react-query";
import { Form, Link, redirect, useRouteLoaderData } from "react-router-dom";
import { IUpdateAddColumn } from "../../models/dto/column/IUpdateAddColumn";
import { IUpdateColumnDTO } from "../../models/dto/column/IUpdateColumn";
import { IUpdateColumnOrderDTO } from "../../models/dto/column/IUpdateColumnOrderDTO";
import { Project } from "../../models/entities/Project";
import { Task } from "../../models/entities/Task";
import ActionButton from "../../ui/buttons/ActionButton";
import ColumnWrapperCard from "../../ui/cards/ColumnWrapperCard";
import SelectedTaskCard from "../../ui/cards/SelectedTaskCard";
import DisplayField from "../../ui/display-field/DisplayField";

export const action =
  (
    queryClient: QueryClient,
    addNewColumn: (
      projectId: string,
      columnDto: IUpdateAddColumn
    ) => Promise<AxiosResponse<void, any>> | null,
    updateColumn: (
      projectId: string,
      columnDto: IUpdateColumnDTO
    ) => Promise<AxiosResponse<void, any>> | null,
    deleteColumn: (
      projectId: string,
      columnId: string
    ) => Promise<AxiosResponse<void, any>>,
    changeColumnOrder: (
      projectId: string,
      columnOrderDto: IUpdateColumnOrderDTO
    ) => Promise<AxiosResponse<void, any>>
  ) =>
  async ({ request, params }: any) => {
    const formData = await request.formData();
    const formId = formData.get("form-id");

    if (formId == "addColumnForm") {
      let column = { name: "New Column" };

      await addNewColumn(params.id, column as IUpdateAddColumn);
      await queryClient.invalidateQueries({
        queryKey: ["project", params.id],
      });
    } else if (formId == "updateColumnForm") {
      formData.delete("form-id");
      let columnDto = Object.fromEntries(formData);
      await updateColumn(params.id, columnDto as IUpdateColumnDTO);
      await queryClient.invalidateQueries({
        queryKey: ["project", params.id],
      });
    } else if (formId == "deleteColumnForm") {
      formData.delete("form-id");
      let columnId = Object.fromEntries(formData);
      await deleteColumn(params.id, columnId.id);
      await queryClient.invalidateQueries({
        queryKey: ["project", params.id],
      });
    } else if (formId == "updateColumnOrder") {
      formData.delete("form-id");
      let data = Object.fromEntries(formData);
      await changeColumnOrder(params.id, data as IUpdateColumnOrderDTO);
      await queryClient.invalidateQueries({
        queryKey: ["project", params.id],
      });
    }
    return redirect(`./kanban`);
  };

export default function KanbanPage() {
  const project = useRouteLoaderData("selectedProject") as Project;
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isManageColumnsOn, setIsManageColumnsOn] = useState<boolean>(false);

  if (!project) {
    return <>Loading</>;
  }

  return (
    <div
      className={
        selectedTask
          ? "flex h-full w-full overflow-hidden py-3"
          : "relative flex h-full w-full overflow-scroll py-3"
      }
    >
      <Link to={"../"}>
        <div className="ml-3 flex h-14 w-[37rem] items-center justify-between gap-3 rounded-lg border border-neutral-600 bg-neutral-800/20 p-2 pr-4 transition hover:bg-neutral-800/40">
          <div className="w-max">
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
      </Link>
      <div className="ml-4 flex h-14 w-72">
        <ActionButton
          content={isManageColumnsOn ? "Done" : "Manage columns"}
          icon={
            isManageColumnsOn ? (
              <CheckCircleIcon className="w-5 text-indigo-500"></CheckCircleIcon>
            ) : (
              <Cog6ToothIcon className="w-5 text-indigo-500"></Cog6ToothIcon>
            )
          }
          color={"indigo"}
          onClick={() => setIsManageColumnsOn(!isManageColumnsOn)}
        ></ActionButton>
      </div>
      <div className="absolute top-20 flex h-[calc(100%-5rem)] w-max justify-center gap-4 overflow-scroll pl-3 pb-3  md:justify-start 2xl:justify-center">
        {project.columns
          .sort((a, b) => a.order - b.order)
          .map((col, index) => {
            return (
              <div key={index} className="flex h-full w-72">
                <ColumnWrapperCard
                  project={project}
                  column={col}
                  isManageColumnsOn={isManageColumnsOn}
                  taskClicked={(task) => {
                    setSelectedTask(task);
                  }}
                ></ColumnWrapperCard>
              </div>
            );
          })}
        <Form
          action="../"
          method="post"
          className="flex h-full w-72 flex-col gap-2 overflow-scroll "
        >
          <input name="form-id" hidden defaultValue="addColumnForm" />
          <button
            type={"submit"}
            className={
              "flex h-14 w-full items-center gap-4 rounded-lg border border-neutral-600 bg-neutral-900 px-3 py-2 transition hover:border-neutral-300 hover:drop-shadow-4xl hover:transition"
            }
          >
            <div
              className={
                "flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-200/20"
              }
            >
              <PlusIcon className="w-5 text-neutral-300"></PlusIcon>
            </div>
            <p className="m-0 font-serif text-sm font-semibold tracking-wider">
              Add Column
            </p>
          </button>
        </Form>
      </div>
      {selectedTask !== null ? (
        <div className="absolute top-0 flex h-max min-h-full w-full justify-start bg-neutral-900/90 pb-12 pl-4 pt-4">
          <SelectedTaskCard
            teamId={project.teamId}
            selectedTask={selectedTask}
            onClose={() => setSelectedTask(null)}
            project={project}
          ></SelectedTaskCard>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
}
