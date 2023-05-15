import {
  BellIcon,
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  TagIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useState } from "react";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "react-query";
import { Form, useParams } from "react-router-dom";
import useTaskService from "../../hooks/service/useTaskService";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { Column } from "../../models/entities/Column";
import { Project } from "../../models/entities/Project";
import { Task } from "../../models/entities/Task";
import { DateHelper } from "../../util/helpers/DateHelper";
import ActionButton from "../buttons/ActionButton";
import FilledButton from "../buttons/FilledButton";
import DateInput from "../inputs/DateInput";
import TextareaInput from "../inputs/TextareaInput";
import TextInput from "../inputs/TextInput";
import TaskCard from "./TaskCard";

interface IProps {
  column: Column;
}

export const action =
  (
    queryClient: QueryClient,
    createTask: (
      projectId: string,
      taskDto: ICreateTaskDTO
    ) => Promise<AxiosResponse<Task, any>>
  ) =>
  async ({ request, params }: any) => {
    const formData = await request.formData();
    const task = Object.fromEntries(formData) as ICreateTaskDTO;
    const newTask = await createTask(params.id, task);
    await queryClient.invalidateQueries({
      queryKey: ["task", params.id, "projects", "project", "tasks"],
    });
    return null;
  };

const tasksFromColumnQuery = (
  projectId: string,
  columnId: string,
  getTasksByColumnId: (
    columnId: string,
    projectId: string
  ) => Promise<AxiosResponse<Task[], any>>
) => ({
  queryKey: ["task", "column", "project", projectId, columnId],
  queryFn: async () => {
    const response = await getTasksByColumnId(columnId, projectId);
    if (response.status == 403) {
      throw new Error("Token expired");
    }
    if (!response) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return response.data;
  },
});

export default function ColumnWrapperCard(props: IProps) {
  const { column } = props;

  const { getTasksByColumnId, createNewTask } = useTaskService();
  const { id } = useParams();
  if (!id) {
    return <p>Loading</p>;
  }
  const queryClient = useQueryClient();

  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showCreate, setShowCreate] = useState<boolean>(false);

  const mutation = useMutation({
    mutationFn: (taskDto: ICreateTaskDTO) => {
      return createNewTask(id, taskDto);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["task", "column", "project", id, column._id],
      });
    },
  });

  const { data: tasks } = useQuery(
    tasksFromColumnQuery(id, column._id, getTasksByColumnId)
  );
  return (
    <div className="flex h-full w-full flex-col gap-2 ">
      <div className="min-h-16 flex h-16 w-full items-center justify-between rounded-lg border border-neutral-600 px-3">
        <p className="neutral-500 font-serif text-base tracking-wider">
          {column.name + " | " + tasks?.length}
        </p>
        <div className="flex h-7 w-7 cursor-pointer items-center justify-center">
          <EllipsisHorizontalIcon></EllipsisHorizontalIcon>
        </div>
      </div>
      <FilledButton
        content={"New Task"}
        removeBackground={false}
        icon={<PlusIcon className="w-5 text-neutral-300"></PlusIcon>}
        onClick={() => setShowCreate(true)}
      ></FilledButton>
      <div className="flex h-full w-full flex-col  overflow-scroll">
        {showCreate ? (
          <div className="mb-3 flex w-full flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800/30 p-2">
            <TextInput
              placeholder={"Title.."}
              value={title}
              icon={<TagIcon className="w-5 text-neutral-300"></TagIcon>}
              onChange={(newVal) => setTitle(newVal)}
              name="title"
            ></TextInput>
            <DateInput
              icon={<ClockIcon className="w-5 text-neutral-300"></ClockIcon>}
              onChange={(newVal) => setStartDate(new Date(newVal))}
              value={DateHelper.formatDateToString(startDate, "YYYY-MM-DD")}
              name={"startDate"}
            ></DateInput>
            <input type="hidden" value={column._id} name="columnId" />
            <DateInput
              icon={
                <CheckCircleIcon className="w-5 text-neutral-300"></CheckCircleIcon>
              }
              onChange={(newVal) => setEndDate(new Date(newVal))}
              value={DateHelper.formatDateToString(endDate, "YYYY-MM-DD")}
              name={"endDate"}
            ></DateInput>
            <div className="flex h-max w-full gap-2">
              <div className="grow">
                <button
                  onClick={() =>
                    mutation.mutate({
                      title: title,
                      startDate: startDate,
                      endDate: endDate,
                      columnId: column._id,
                    })
                  }
                  className="w-full rounded border border-indigo-500 bg-neutral-900 py-1.5 px-3 text-sm text-indigo-500  transition hover:border-neutral-400"
                >
                  <p className="mt-0.5 tracking-wider">SAVE</p>
                </button>
              </div>
              <div className="grow">
                <button
                  onClick={() => setShowCreate(false)}
                  className="w-full rounded border border-neutral-600 bg-neutral-900 py-1.5 px-3 text-sm text-neutral-500 transition hover:border-neutral-400"
                >
                  <p className="mt-0.5 tracking-wider">CANCEL</p>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
        <div className="flex w-full flex-col gap-2  rounded-lg">
          {tasks && tasks.length > 0 ? (
            tasks
              .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
              .map((task, index) => {
                return (
                  <div key={index} className="w-full">
                    <TaskCard task={task}></TaskCard>
                  </div>
                );
              })
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}
