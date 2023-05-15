import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Task } from "../../models/entities/Task";

const useTaskService = () => {
  const { get } = useHttp();
  const bastPath = "/api/task";

  const getTasksByColumnId = (columnId: string, projectId: string) => {
    return get<void, AxiosResponse<Task[]>>(
      bastPath + "/" + projectId + "/column/" + columnId,
      {
        withCredentials: true,
      }
    );
  };

  return {
    getTasksByColumnId,
  };
};

export default useTaskService;
