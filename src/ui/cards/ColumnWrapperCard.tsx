import {
  CheckCircleIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Draggable from "react-draggable";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Form, useParams, useSubmit } from "react-router-dom";
import useTaskService from "../../hooks/service/useTaskService";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { Column } from "../../models/entities/Column";
import { Project } from "../../models/entities/Project";
import { Task } from "../../models/entities/Task";
import FilledButton from "../buttons/FilledButton";
import ActionInput from "../inputs/ActionInput";
import CreateTaskCard from "./CreateTaskCard";
import TaskCard from "./TaskCard";
import update from "immutability-helper";
import { IUpdateTaskOrderDTO } from "../../models/dto/task/IUpdateTaskOrderDTO";

interface IProps {
  column: Column;
  project: Project;
  taskClicked: (task: Task) => void;
  isManageColumnsOn: boolean;
}

const tasksFromColumnQuery = (
  projectId: string,
  columnId: string,
  getTasksByColumnId: (
    columnId: string,
    projectId: string
  ) => Promise<AxiosResponse<Task[], any>>
) => ({
  queryKey: [columnId],
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
  const { column, project, taskClicked, isManageColumnsOn } = props;
  const { getTasksByColumnId, createNewTask, updateTaskOrder } =
    useTaskService();
  const submit = useSubmit();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const columnRef = useRef<any>(null);
  const lineRef = useRef<any>(null);

  if (!id) {
    return <p>Loading</p>;
  }

  const { data: tasks } = useQuery(
    tasksFromColumnQuery(id, column._id, getTasksByColumnId)
  );

  const [xPosition, setXPosition] = useState<number | null>(null);

  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [stateTasks, setStateTasks] = useState<Task[]>([]);

  const mutation = useMutation({
    mutationFn: (taskDto: ICreateTaskDTO) => {
      return createNewTask(id, taskDto);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [column._id],
      });
      setShowCreate(false);
    },
  });

  const mutationTaskOrder = useMutation({
    mutationFn: (taskDto: IUpdateTaskOrderDTO) => {
      return updateTaskOrder(taskDto);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [column._id],
      });
    },
  });

  useEffect(() => {
    if (tasks) {
      setStateTasks(tasks);
    }
  }, [tasks]);

  const handleColumnDrag = (ev: any) => {
    if (xPosition && xPosition >= 596.8 && ev.movementX > 0) {
      return;
    }
    if (xPosition && xPosition <= -314 && ev.movementX < 0) {
      return;
    }
    setXPosition((prev) => {
      if (prev) {
        if (ev.movementX > 0) {
          return prev + 304;
        } else {
          return prev - 304;
        }
      } else {
        if (ev.movementX > 0) {
          return 292.8;
        } else {
          return -10;
        }
      }
    });
  };

  const handleColumnStopDrag = (ev: any) => {
    if (xPosition) {
      const newPosition = Math.floor(xPosition / 304);

      if (newPosition !== 0 && newPosition !== -1) {
        const newOrder = newPosition < -1 ? column.order - 1 : column.order + 1;
        let formData = new FormData();
        formData.append("columnId", column._id);
        formData.append("order", newOrder.toString());
        formData.append("form-id", "updateColumnOrder");
        submit(formData, {
          method: "post",
          action: "/user/projects/" + id,
        });
      }
    }

    setXPosition(null);
  };

  const moveCard = useCallback((dragIndex: number, hoverIndex: number) => {
    setStateTasks((prevCards: Task[]) => {
      const updatedArray = update(prevCards, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, prevCards[dragIndex] as Task],
        ],
      });
      mutationTaskOrder.mutate({
        columnId: column._id,
        projectId: project._id,
        tasks: updatedArray.map((task) => task._id),
      });
      return updatedArray;
    });
  }, []);

  const renderCard = useCallback((card: Task, index: number) => {
    if (!card) {
      return;
    }
    return (
      <TaskCard
        key={card._id}
        onClick={() => {
          taskClicked(card);
        }}
        index={index}
        task={card}
        moveCard={moveCard}
        id={card._id}
      ></TaskCard>
    );
  }, []);

  return (
    <div className="relative flex h-full max-h-full w-full">
      <div
        style={{
          left: xPosition !== null ? xPosition : 0,
          display: xPosition !== null ? "flex" : "none",
        }}
        ref={lineRef}
        className="absolute left-[292.8px] top-0 z-20 flex h-full w-1 justify-end"
      >
        <div className="h-full border-r-2 border-indigo-500"></div>
      </div>
      <Draggable
        axis="none"
        nodeRef={columnRef}
        defaultPosition={{ x: 0, y: 0 }}
        grid={[304, 304]}
        bounds={{ left: 304, right: 304 }}
        handle=".handle"
        onDrag={handleColumnDrag}
        onStop={handleColumnStopDrag}
      >
        <div
          ref={columnRef}
          className="flex h-max max-h-full w-full flex-col gap-2 "
        >
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
            </div>
          ) : (
            <div className="handle mb-0.5 flex min-h-[3.5rem] w-full basis-14 cursor-grab items-center justify-between rounded-lg border border-neutral-600 ">
              <p className="neutral-500 ml-3 font-serif text-base tracking-wider">
                {tasks ? column.name + " | " + tasks.length : column.name}
              </p>
              <div className="mr-3 flex w-max items-center gap-2">
                {isManageColumnsOn ? (
                  <Form
                    action="../"
                    method="post"
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-red-900/30"
                  >
                    <input
                      name="form-id"
                      hidden
                      defaultValue="deleteColumnForm"
                    />
                    <input name="id" hidden defaultValue={column._id} />
                    <button type="submit">
                      <TrashIcon className="w-5 text-red-700"></TrashIcon>
                    </button>
                  </Form>
                ) : (
                  <div
                    onClick={() => {
                      setIsEditOn(true);
                      setName(column.name);
                    }}
                    className="flex h-8 w-8 cursor-pointer items-center justify-center rounded bg-neutral-700/60"
                  >
                    <PencilSquareIcon className="w-5 text-neutral-300"></PencilSquareIcon>
                  </div>
                )}
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
                {stateTasks.map((card, i) => renderCard(card, i))}
              </div>
            ) : (
              <></>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
}
