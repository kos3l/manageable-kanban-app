import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Task } from "../../models/entities/Task";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";
import { IUpdateTaskDTO } from "../../models/dto/task/IUpdateTaskDTO";

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

  const deleteTask = (taskId: string) => {
    return remove<ICreateTaskDTO, AxiosResponse<Task>>(
      bastPath + "/" + taskId,
      {
        withCredentials: true,
      }
    );
  };

  return {
    getTasksByColumnId,
    createNewTask,
    getTaskById,
    updateTask,
    deleteTask,
  };
};

export default useTaskService;
