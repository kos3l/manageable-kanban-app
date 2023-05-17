import {
  CheckCircleIcon,
  EllipsisHorizontalIcon,
  PencilIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
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
import FilledButton from "../buttons/FilledButton";
import ActionInput from "../inputs/ActionInput";
import TextInput from "../inputs/TextInput";
import CreateTaskCard from "./CreateTaskCard";
import TaskCard from "./TaskCard";

interface IProps {
  column: Column;
  project: Project;
  taskClicked: (task: Task) => void;
}

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
    return response.data.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  },
});

export default function ColumnWrapperCard(props: IProps) {
  const { column, project, taskClicked } = props;
  const { getTasksByColumnId, createNewTask } = useTaskService();
  const { id } = useParams();
  const queryClient = useQueryClient();
  if (!id) {
    return <p>Loading</p>;
  }

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [name, setName] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (taskDto: ICreateTaskDTO) => {
      return createNewTask(id, taskDto);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["task", "column", "project", id, column._id],
      });
      setShowCreate(false);
    },
  });
  const { data: tasks } = useQuery(
    tasksFromColumnQuery(id, column._id, getTasksByColumnId)
  );

  return (
    <div className="flex h-max max-h-full w-full flex-col gap-2 ">
      {isEditOn ? (
        <div className="flex min-h-[3.5rem] w-full basis-14 items-center">
          <Form
            action="../"
            method="post"
            className="flex w-full items-center gap-1"
            onSubmit={() => setIsEditOn(false)}
          >
            <input name="form-id" hidden defaultValue="updateColumnForm" />
            <input name="id" hidden defaultValue={column._id} />
            <div className="h-max w-full">
              <ActionInput
                placeholder={"Name.."}
                value={name}
                name="name"
                isSubmit={true}
                onChange={(newVal) => setName(newVal)}
                icon={
                  <CheckCircleIcon className="w-5 text-indigo-500"></CheckCircleIcon>
                }
                onClick={() => {}}
              ></ActionInput>
            </div>
          </Form>
          {/* <div className="flex w-max items-center gap-2">
              <div className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-red-900/30">
                <TrashIcon className="w-5 text-red-700"></TrashIcon>
              </div>
            </div> */}
        </div>
      ) : (
        <div className="mb-0.5 flex min-h-[3.5rem] w-full basis-14 items-center justify-between rounded-lg border border-neutral-600 ">
          <p className="neutral-500 ml-3 font-serif text-base tracking-wider">
            {column.name + " | " + tasks?.length}
          </p>
          <div className="mr-3 flex w-max items-center gap-2">
            <div
              onClick={() => {
                setIsEditOn(true);
                setName(column.name);
              }}
              className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-neutral-700/60"
            >
              <PencilSquareIcon className="w-5 text-neutral-300"></PencilSquareIcon>
            </div>
          </div>
        </div>
      )}
      <div className="flex w-full grow flex-col gap-1.5 overflow-scroll rounded-lg border border-neutral-600 p-2">
        <div className="flex h-max w-full flex-col gap-2 ">
          <FilledButton
            content={"New Task"}
            removeBackground={false}
            icon={<PlusIcon className="w-5 text-neutral-300"></PlusIcon>}
            onClick={() => setShowCreate(true)}
          ></FilledButton>
          <CreateTaskCard
            column={column}
            project={project}
            onClose={() => setShowCreate(false)}
            showCreate={showCreate}
            createTask={(dto) => mutation.mutate(dto)}
          ></CreateTaskCard>
        </div>
        {tasks && tasks.length > 0 ? (
          <div className="mt-1 flex w-full flex-col gap-1.5">
            {tasks.map((task, index) => {
              return (
                <div
                  key={index}
                  className="w-full"
                  onClick={() => {
                    taskClicked(task);
                  }}
                >
                  <TaskCard task={task}></TaskCard>
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
