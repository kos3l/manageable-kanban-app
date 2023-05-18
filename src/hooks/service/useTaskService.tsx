import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Task } from "../../models/entities/Task";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { IUpdateTaskDTO } from "../../models/dto/task/IUpdateTaskDTO";
import { IUpdateUserToTask } from "../../models/dto/project/IUpdateUserToTask";
import { IUpdateTaskOrderDTO } from "../../models/dto/task/IUpdateTaskOrderDTO";
import { ICreateLabelDTO } from "../../models/dto/task/ICreateLabelDTO";

const useTaskService = () => {
  const { get, post, put, remove } = useHttp();
  const bastPath = "/api/task";

  const getTasksByColumnId = (columnId: string, projectId: string) => {
    return get<void, AxiosResponse<Task[]>>(
      bastPath + "/" + projectId + "/column/" + columnId,
      {
        withCredentials: true,
      }
    );
  };

  const getTaskById = (taskId: string) => {
    return get<void, AxiosResponse<Task>>(bastPath + "/" + taskId, {
      withCredentials: true,
    });
  };

  const createNewTask = (projectId: string, taskDto: ICreateTaskDTO) => {
    return post<ICreateTaskDTO, AxiosResponse<Task>>(
      bastPath + "/project/" + projectId,
      taskDto,
      {
        withCredentials: true,
      }
    );
  };

  const updateTask = (taskId: string, taskDto: IUpdateTaskDTO) => {
    return put<IUpdateTaskDTO, AxiosResponse<void>>(
      bastPath + "/" + taskId,
      taskDto,
      {
        withCredentials: true,
      }
    );
  };

  const updateTaskOrder = (tasksDto: IUpdateTaskOrderDTO) => {
    return put<IUpdateTaskOrderDTO, AxiosResponse<void>>(
      bastPath + "/column/order",
      tasksDto,
      {
        withCredentials: true,
      }
    );
  };

  const addUserToTask = (taskId: string, userDto: IUpdateUserToTask) => {
    return put<IUpdateUserToTask, AxiosResponse<void>>(
      bastPath + "/" + taskId + "/AddUser",
      userDto,
      {
        withCredentials: true,
      }
    );
  };

  const removeUserFromTask = (taskId: string, userDto: IUpdateUserToTask) => {
    return put<IUpdateUserToTask, AxiosResponse<void>>(
      bastPath + "/" + taskId + "/RemoveUser",
      userDto,
      {
        withCredentials: true,
      }
    );
  };

  const deleteTask = (taskId: string) => {
    return remove<ICreateTaskDTO, AxiosResponse<Task>>(
      bastPath + "/" + taskId,
      {
        withCredentials: true,
      }
    );
  };

  const addLabelToTask = (taskId: string, labelDto: ICreateLabelDTO) => {
    return put<ICreateLabelDTO, AxiosResponse<void>>(
      bastPath + "/" + taskId + "/AddLabel",
      labelDto,
      {
        withCredentials: true,
      }
    );
  };

  const removeLabelFromTask = (taskId: string, labelId: string) => {
    return put<IUpdateUserToTask, AxiosResponse<void>>(
      bastPath + "/" + taskId + "/RemoveLabel/" + labelId,
      undefined,
      {
        withCredentials: true,
      }
    );
  };

  return {
    getTasksByColumnId,
    createNewTask,
    getTaskById,
    addUserToTask,
    removeUserFromTask,
    updateTask,
    updateTaskOrder,
    deleteTask,
    removeLabelFromTask,
    addLabelToTask,
  };
};

export default useTaskService;
