import { AxiosResponse } from "axios";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import { IAccessToken } from "../../auth/context/AuthContext";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";
import { Project } from "../../models/entities/Project";
import { ICreateProjectDTO } from "../../models/dto/project/ICreateProjectDTO";

const useProjectService = () => {
  const { post, get } = useHttp();
  const bastPath = "/api/project";

  const getAllUserProjects = () => {
    return get<void, AxiosResponse<Project[]>>(bastPath + "/user", {
      withCredentials: true,
    });
  };

  const getProjectById = (projectId: string) => {
    return get<void, AxiosResponse<Project>>(bastPath + "/" + projectId, {
      withCredentials: true,
    });
  };

  const createNewProject = (projectDto: ICreateProjectDTO) => {
    return post<ICreateProjectDTO, AxiosResponse<Team>>(bastPath, projectDto, {
      withCredentials: true,
    });
  };

  return { getAllUserProjects, createNewProject, getProjectById };
};

export default useProjectService;
