import { EllipsisHorizontalIcon, PlusIcon } from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useTaskService from "../../hooks/service/useTaskService";
import { Column } from "../../models/entities/Column";
import { Project } from "../../models/entities/Project";
import { Task } from "../../models/entities/Task";
import FilledButton from "../buttons/FilledButton";

interface IProps {
  column: Column;
}

const tasksFromColumnQuery = (
  projectId: string,
  columnId: string,
  getTasksByColumnId: (
    columnId: string,
    projectId: string
  ) => Promise<AxiosResponse<Task[], any>>
) => ({
  queryKey: ["task", "column", projectId, columnId],
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

export default function TaskWrapperCard(props: IProps) {
  const { column } = props;
  const { getTasksByColumnId } = useTaskService();
  const { id } = useParams();
  if (!id) {
    return <p>Loading</p>;
  }

  const { data: tasks } = useQuery(
    tasksFromColumnQuery(id, column._id, getTasksByColumnId)
  );

  return (
    <div className="flex h-full w-full flex-col gap-2 overflow-scroll ">
      <div className="flex h-12 w-full items-center justify-between rounded-lg border border-neutral-600 px-3">
        <p className="neutral-500 font-serif text-base tracking-wider">
          {column.name + " | "}
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
      <div></div>
    </div>
  );
}
