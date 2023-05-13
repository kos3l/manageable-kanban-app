import { AxiosResponse } from "axios";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import { IAccessToken } from "../../auth/context/AuthContext";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";
import { Project } from "../../models/entities/Project";

const useProjectService = () => {
  const { post, get } = useHttp();
  const bastPath = "/api/project";

  const getAllUserProjects = () => {
    return get<void, AxiosResponse<Project[]>>(bastPath + "/user", {
      withCredentials: true,
    });
  };

  return { getAllUserProjects };
};

export default useProjectService;
