import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Task } from "../../models/entities/Task";
import { ICreateTaskDTO } from "../../models/dto/task/ICreateTaskDTO";

const useTaskService = () => {
  const { get, post } = useHttp();
  const bastPath = "/api/task";

  const getTasksByColumnId = (columnId: string, projectId: string) => {
    return get<void, AxiosResponse<Task[]>>(
      bastPath + "/" + projectId + "/column/" + columnId,
      {
        withCredentials: true,
      }
    );
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

  return {
    getTasksByColumnId,
    createNewTask,
  };
};

export default useTaskService;
