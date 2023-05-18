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
  PaperClipIcon,
  PlusCircleIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { Task } from "../../models/entities/Task";
import DisplayField from "../display-field/DisplayField";
import avatar from "../../assets/avatar.png";
import { useRef, useEffect, useState } from "react";
import TextInput from "../inputs/TextInput";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useTaskService from "../../hooks/service/useTaskService";
import { IUpdateTaskDTO } from "../../models/dto/task/IUpdateTaskDTO";
import { DateHelper } from "../../util/helpers/DateHelper";
import DateInput from "../inputs/DateInput";
import TextareaInput from "../inputs/TextareaInput";
import { IUpdateUserToTask } from "../../models/dto/project/IUpdateUserToTask";
import useUserService from "../../hooks/service/useUserService";
import { User } from "../../models/entities/User";
import ActionInput from "../inputs/ActionInput";
import ColorPicker from "../selection/ColorPicker";
import { ICreateLabelDTO } from "../../models/dto/task/ICreateLabelDTO";
import LabelCard from "./LabelCard";

interface IProps {
  selectedTask: Task;
  teamId: string;
  onClose: () => void;
}

export default function SelectedtTaskCard(props: IProps) {
  // SECTION: Const and Variables
  const { selectedTask, onClose, teamId } = props;
  const {
    updateTask,
    getTaskById,
    deleteTask,
    addUserToTask,
    removeUserFromTask,
    addLabelToTask,
    removeLabelFromTask,
  } = useTaskService();
  const { getUsersByTeamId } = useUserService();
  const queryClient = useQueryClient();
  const mainRef = useRef<any>(null);

  // SECTION: Data fetching
  const { data } = useQuery({
    queryKey: ["task", "column", selectedTask._id],
    queryFn: async () => {
      const response = await getTaskById(selectedTask._id);
      console.log(response);
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

  const { data: users } = useQuery({
    queryKey: ["task", "team", teamId],
    queryFn: async () => {
      const response = await getUsersByTeamId(teamId);
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

  // SECTION: State
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [title, setTitle] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [description, setDescription] = useState<string>("");
  const [labelName, setLabelName] = useState<string>("");
  const [labelColor, setLabelColor] = useState<string>("#db2777");

  // SECTION: UseEffects
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // SECTION: Mutations
  const updateTaskMutation = useMutation({
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

  const deleteTaskMutation = useMutation({
    mutationFn: () => {
      return deleteTask(selectedTask._id);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [
          "task",
          "column",
          "project",
          selectedTask.projectId,
          selectedTask.columnId,
        ],
      });
      onClose();
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
      queryClient.invalidateQueries({
        queryKey: [selectedTask.columnId],
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
      queryClient.invalidateQueries({
        queryKey: [selectedTask.columnId],
      });
    },
  });

  const addLabelMutation = useMutation({
    mutationFn: (labelDto: ICreateLabelDTO) => {
      return addLabelToTask(selectedTask._id, labelDto);
    },
    onSuccess: (data, variables, context) => {
      setLabelName("");
      setLabelColor("#db2777");
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
      queryClient.invalidateQueries({
        queryKey: [selectedTask.columnId],
      });
    },
  });

  const removeLabelMutation = useMutation({
    mutationFn: (labelId: string) => {
      return removeLabelFromTask(selectedTask._id, labelId);
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
      queryClient.invalidateQueries({
        queryKey: [selectedTask.columnId],
      });
    },
  });

  // SECTION: State and UI managing functions
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
      deleteTaskMutation.mutate();
    }
  };

  const handleOnUserTagClik = (task: Task, user: User) => {
    if (addUserMutation.isLoading || removeUserMutation.isLoading) {
      return;
    }
    if (task.userIds.includes(user._id)) {
      removeUserMutation.mutate({
        userId: user._id,
      });
    } else {
      addUserMutation.mutate({
        userId: user._id,
      });
    }
  };

  if (!data) {
    return <p>Loading</p>;
  }

  // SECTION: UI
  return (
    <div
      ref={mainRef}
      className="relative flex h-max w-[95vw] flex-wrap overflow-scroll rounded-lg border border-neutral-700 bg-neutral-900 pb-2 md:w-[550px] lg:w-[800px] 2xl:w-1/2"
    >
      <div className="h-44 w-full bg-gradient-to-r from-violet-600 to-indigo-500"></div>
      <div className="absolute right-0 top-2">
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
      <div className="flex w-full flex-wrap p-4">
        <div className="flex w-3/4 flex-wrap items-start justify-between gap-2">
          {isEditOn ? (
            <div className="flex w-full flex-col">
              {data.labels && data.labels.length > 0 ? (
                <div className="mt-1 mb-4 flex w-full flex-wrap gap-2">
                  {data.labels.map((label, index) => (
                    <LabelCard
                      onClick={() => removeLabelMutation.mutate(label._id)}
                      label={label}
                      key={index}
                    ></LabelCard>
                  ))}
                </div>
              ) : (
                <></>
              )}
              <div className="mb-3 flex w-full flex-wrap gap-2">
                <ColorPicker
                  value={labelColor}
                  onSelectValue={(newVal) => setLabelColor(newVal)}
                ></ColorPicker>
                <div className="grow">
                  <ActionInput
                    placeholder={"Label"}
                    icon={<PlusIcon className="w-4 text-indigo-500"></PlusIcon>}
                    value={labelName}
                    onChange={(newVal) => setLabelName(newVal)}
                    onClick={() => {
                      if (labelName && labelColor) {
                        addLabelMutation.mutate({
                          name: labelName,
                          color: labelColor,
                        });
                      }
                    }}
                  ></ActionInput>
                </div>
              </div>
              <TextInput
                placeholder={"Title"}
                icon={<TagIcon className="w-5 text-neutral-300"></TagIcon>}
                value={title}
                onChange={(newVal) => setTitle(newVal)}
              ></TextInput>
            </div>
          ) : (
            <>
              {data.labels && data.labels.length > 0 ? (
                <div className="mt-1 flex w-full flex-wrap gap-2">
                  {data.labels.map((label, index) => (
                    <LabelCard label={label} key={index}></LabelCard>
                  ))}
                </div>
              ) : (
                <></>
              )}
              <p className="break-word w-full max-w-full font-serif text-xl tracking-wider">
                {data.title}
              </p>
            </>
          )}
          {isEditOn ? (
            <div className="flex grow gap-2">
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
        </div>
        <div className="flex w-1/4 flex-col-reverse items-end justify-end gap-2">
          {isEditOn ? (
            <button
              onClick={() => {
                updateTaskMutation.mutate({
                  title: title,
                  description: description,
                  startDate: startDate,
                  endDate: endDate,
                });
                setIsEditOn(false);
              }}
              className="flex w-24 items-center gap-1 rounded border border-indigo-600 py-1 px-3 transition hover:bg-indigo-700/10"
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
                className="flex w-24 items-center gap-1 rounded bg-red-900/20 py-1 px-2 transition hover:bg-red-900/40"
              >
                <TrashIcon className="w-4 rounded text-red-800"></TrashIcon>
                <p className="mt-0.5 text-sm tracking-wider text-red-800">
                  Delete
                </p>
              </button>
              <button
                onClick={() => setIsEditOn(true)}
                className="flex w-24 items-center gap-1 rounded bg-indigo-600/20 py-1 px-4 transition hover:bg-indigo-600/40"
              >
                <PencilSquareIcon className="w-4 rounded text-indigo-600"></PencilSquareIcon>
                <p className="mt-0.5 text-sm tracking-wider text-indigo-500">
                  Edit
                </p>
              </button>
            </>
          )}
        </div>
        <div className="mt-6 flex h-max w-full gap-2">
          <div className="mr-1 flex grow border-r border-neutral-600 pr-2">
            {isEditOn ? (
              <div className="flex w-full flex-col gap-1">
                <TextareaInput
                  icon={
                    <Bars3CenterLeftIcon className="m-0 w-4 p-0"></Bars3CenterLeftIcon>
                  }
                  placeholder="Description.."
                  value={description}
                  onChange={(val) => setDescription(val)}
                  name="description"
                ></TextareaInput>
                <p className="mt-4 mb-2 w-3/4 border-b border-neutral-500 pb-1 text-sm tracking-wider opacity-50">
                  Manage users
                </p>
                <div className="flex w-full flex-wrap gap-2">
                  {users && users.length > 0 ? (
                    <>
                      {users.map((user) => {
                        return (
                          <div
                            key={user._id}
                            onClick={() => handleOnUserTagClik(data, user)}
                            className={
                              addUserMutation.isLoading ||
                              removeUserMutation.isLoading
                                ? "flex h-12 w-max cursor-pointer items-center justify-between gap-2 overflow-scroll rounded-lg border border-neutral-700 bg-neutral-900/10 pl-2 pr-4 opacity-20"
                                : data.userIds.includes(user._id)
                                ? "flex h-12 w-max cursor-pointer items-center justify-between gap-2 overflow-scroll rounded-lg border border-pink-600 bg-pink-800/10 pl-2 pr-4"
                                : "flex h-12 w-max cursor-pointer items-center justify-between gap-2 overflow-scroll rounded-lg border border-neutral-600 bg-neutral-800/50 pl-2 pr-4 transition hover:border-pink-600 "
                            }
                          >
                            <div className="flex w-max gap-2">
                              <div className="w-7 overflow-hidden rounded-lg">
                                <img
                                  src={avatar}
                                  alt=""
                                  className="h-full w-full object-contain"
                                />
                              </div>
                              <p className="max.w mt-1 truncate">
                                <span className="opacity-70">
                                  {user.firstName + " " + user.lastName}
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </>
                  ) : (
                    <></>
                  )}
                </div>
                <div></div>
              </div>
            ) : (
              <DisplayField
                color="white"
                label="Description"
                value={data.description}
                placeholder={"No Description"}
              ></DisplayField>
            )}
          </div>
          <div className="flex min-w-[11rem] basis-[11rem] flex-col leading-4">
            <p className="text-xs tracking-wider text-neutral-500">
              Assigned members
            </p>
            {data.users && data.users.length > 0 ? (
              <div className="mt-1 flex w-full flex-col gap-2">
                {data.users
                  .sort((a, b) => (a.firstName > b.firstName ? 1 : -1))
                  .map((user, index) => {
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
