import {
  PencilSquareIcon,
  XMarkIcon,
  BellIcon,
  BellAlertIcon,
  TrashIcon,
  CheckCircleIcon,
  TagIcon,
  ClockIcon,
  Bars3CenterLeftIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Task } from "../../models/entities/Task";
import DisplayField from "../display-field/DisplayField";
import avatar from "../../assets/avatar.png";
import { useRef, useEffect, useState } from "react";
import TextInput from "../inputs/TextInput";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useTaskService from "../../hooks/service/useTaskService";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { IUpdateTaskDTO } from "../../models/dto/task/IUpdateTaskDTO";
import { DateHelper } from "../../util/helpers/DateHelper";
import DateInput from "../inputs/DateInput";
import TextareaInput from "../inputs/TextareaInput";
import { AxiosResponse } from "axios";
import { IUpdateUserToTask } from "../../models/dto/project/IUpdateUserToTask";

interface IProps {
  selectedTask: Task;
  onClose: () => void;
}

export default function SelectedtTaskCard(props: IProps) {
  const { selectedTask, onClose } = props;
  const {
    updateTask,
    getTaskById,
    deleteTask,
    addUserToTask,
    removeUserFromTask,
  } = useTaskService();
  const queryClient = useQueryClient();
  const mainRef = useRef<any>(null);

  const { data } = useQuery({
    queryKey: ["task", "column", selectedTask._id],
    queryFn: async () => {
      const response = await getTaskById(selectedTask._id);
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
    onSuccess: (data) => {
      setTitle(data.title);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setDescription(data.description);
    },
  });

  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>("");

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (taskDto: IUpdateTaskDTO) => {
      return updateTask(selectedTask._id, taskDto);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["task", "column", selectedTask._id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "task",
          "column",
          "project",
          selectedTask.projectId,
          selectedTask.columnId,
        ],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      return deleteTask(selectedTask._id);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["task", "column", selectedTask._id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "task",
          "column",
          "project",
          selectedTask.projectId,
          selectedTask.columnId,
        ],
      });
    },
  });

  const addUserMutation = useMutation({
    mutationFn: (userDto: IUpdateUserToTask) => {
      return addUserToTask(selectedTask._id, userDto);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["task", "column", selectedTask._id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "task",
          "column",
          "project",
          selectedTask.projectId,
          selectedTask.columnId,
        ],
      });
    },
  });

  const removeUserMutation = useMutation({
    mutationFn: (userDto: IUpdateUserToTask) => {
      return removeUserFromTask(selectedTask._id, userDto);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["task", "column", selectedTask._id],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "task",
          "column",
          "project",
          selectedTask.projectId,
          selectedTask.columnId,
        ],
      });
    },
  });

  const handleClickOutside = (event: MouseEvent) => {
    if (mainRef.current && !mainRef.current.contains(event.target)) {
      onClose();
      clearState();
    }
  };

  const clearState = () => {
    if (data) {
      setTitle(data.title);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
      setDescription(data.description);
    }
  };

  const handleDeleteTask = () => {
    const warning = confirm(
      "This action will delete the task. Do you want to proceed?"
    );
    if (warning) {
      deleteMutation.mutate();
    }
  };

  if (!data) {
    return <p>Loading</p>;
  }

  return (
    <div
      ref={mainRef}
      className="relative flex h-max w-[95vw] flex-col overflow-scroll rounded-lg border border-neutral-700 bg-neutral-900 pb-4 md:w-[550px] lg:w-[700px] 2xl:w-1/2"
    >
      <div className="h-44 w-full bg-pink-900/20"></div>
      <div className="flex w-full flex-col gap-3 p-4">
        <div className="flex w-full items-start justify-between gap-2">
          {isEditOn ? (
            <div className="grow">
              <TextInput
                placeholder={"Title"}
                icon={<TagIcon className="w-5 text-neutral-300"></TagIcon>}
                value={title}
                onChange={(newVal) => setTitle(newVal)}
              ></TextInput>
            </div>
          ) : (
            <p className="max-w-2/4 break-word font-serif text-xl tracking-wider">
              {data.title}
            </p>
          )}
          <div className="flex w-max  justify-end gap-2 ">
            {isEditOn ? (
              <button
                onClick={() => {
                  mutation.mutate({
                    title: title,
                    description: description,
                    startDate: startDate,
                    endDate: endDate,
                  });
                  setIsEditOn(false);
                }}
                className="flex grow items-center gap-1 rounded border border-indigo-600 py-1 px-3 transition hover:bg-indigo-700/10"
              >
                <CheckCircleIcon className="w-4 rounded text-indigo-600"></CheckCircleIcon>
                <p className="mt-0.5 text-sm tracking-wider text-indigo-500">
                  Save
                </p>
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleDeleteTask()}
                  className="flex w-max items-center gap-1 rounded bg-red-900/20 py-1 px-2 transition hover:bg-red-900/40"
                >
                  <TrashIcon className="w-4 rounded text-red-800"></TrashIcon>
                  <p className="mt-0.5 text-sm tracking-wider text-red-800">
                    Delete
                  </p>
                </button>
                <button
                  onClick={() => setIsEditOn(true)}
                  className="flex w-max items-center gap-1 rounded bg-indigo-600/20 py-1 px-4 transition hover:bg-indigo-600/40"
                >
                  <PencilSquareIcon className="w-4 rounded text-indigo-600"></PencilSquareIcon>
                  <p className="mt-0.5 text-sm tracking-wider text-indigo-500">
                    Edit
                  </p>
                </button>
              </>
            )}
            <button
              onClick={
                isEditOn
                  ? () => {
                      setIsEditOn(false);
                      clearState();
                    }
                  : () => {
                      onClose();
                      clearState();
                    }
              }
              className="flex w-max  min-w-[2rem] items-center justify-center rounded bg-neutral-700/40 p-1 transition hover:bg-neutral-700/60"
            >
              <XMarkIcon className="w-5 rounded text-neutral-400"></XMarkIcon>
            </button>
          </div>
        </div>
        {isEditOn ? (
          <div className="flex w-full gap-2">
            <DateInput
              icon={<ClockIcon className="w-5 text-neutral-300"></ClockIcon>}
              onChange={(newVal) => setStartDate(new Date(newVal))}
              value={DateHelper.formatDateToString(startDate, "YYYY-MM-DD")}
              name={"startDate"}
            ></DateInput>
            <DateInput
              icon={
                <CheckCircleIcon className="w-5 text-neutral-300"></CheckCircleIcon>
              }
              onChange={(newVal) => setEndDate(new Date(newVal))}
              value={DateHelper.formatDateToString(endDate, "YYYY-MM-DD")}
              name={"endDate"}
            ></DateInput>
          </div>
        ) : (
          <div className="flex w-max gap-4">
            <DisplayField
              color="white"
              label={"Start Date"}
              placeholder={"Date not found"}
              value={new Date(data.startDate).toLocaleDateString()}
              icon={<BellIcon className="w-6 text-neutral-300"></BellIcon>}
            ></DisplayField>
            <DisplayField
              color={new Date() > new Date(data.endDate) ? "red" : "white"}
              label={"End Date"}
              placeholder={"Date not found"}
              icon={
                <BellAlertIcon
                  className={
                    new Date() > new Date(data.endDate)
                      ? "w-6 text-red-700"
                      : "w-6 text-neutral-300"
                  }
                ></BellAlertIcon>
              }
              value={new Date(data.endDate).toLocaleDateString()}
            ></DisplayField>
          </div>
        )}
        <div className="mt-2 flex h-max w-full gap-2">
          <div className="mr-1 flex grow border-r border-neutral-600 pr-2">
            {isEditOn ? (
              <TextareaInput
                icon={
                  <Bars3CenterLeftIcon className="m-0 w-4 p-0"></Bars3CenterLeftIcon>
                }
                placeholder="Description.."
                value={description}
                onChange={(val) => setDescription(val)}
                name="description"
              ></TextareaInput>
            ) : (
              <DisplayField
                color="white"
                label="Description"
                value={data.description}
                placeholder={"No Description"}
              ></DisplayField>
            )}
          </div>
          <div className="flex basis-[11rem] flex-col leading-4">
            <p className="text-xs tracking-wider text-neutral-500">
              Assigned members
            </p>
            {data.users && data.users.length > 0 ? (
              <div className="mt-1 flex w-full flex-col">
                {data.users.map((user, index) => {
                  return (
                    <Link to={"/users/profile/" + user._id} key={index}>
                      <div
                        key={user._id}
                        className={
                          "flex h-max w-full max-w-[10rem] items-center justify-between gap-2 overflow-scroll  transition hover:text-pink-500"
                        }
                      >
                        <div className="flex grow gap-2 truncate">
                          <div className="basis-7 overflow-hidden rounded-lg">
                            <img
                              src={avatar}
                              alt=""
                              className="h-full w-full object-contain"
                            />
                          </div>
                          <p className="mt-2 grow truncate">
                            <span className="opacity-70">
                              {user.firstName + " " + user.lastName}
                            </span>
                          </p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-neutral-700">No users added..</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
