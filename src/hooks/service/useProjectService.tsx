import { AxiosResponse } from "axios";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import { IAccessToken } from "../../auth/context/AuthContext";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";
import { Project } from "../../models/entities/Project";
import { ICreateProjectDTO } from "../../models/dto/project/ICreateProjectDTO";
import { IUpdateProjectDTO } from "../../models/dto/project/IUpdateProjectDTO";
import { IUpdateAddColumn } from "../../models/dto/column/IUpdateAddColumn";
import { IUpdateColumnDTO } from "../../models/dto/column/IUpdateColumn";

const useProjectService = () => {
  const { post, get, put } = useHttp();
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

  const updateProject = (projectId: string, projectDto: IUpdateProjectDTO) => {
    return put<IUpdateProjectDTO, AxiosResponse<void>>(
      bastPath + "/" + projectId,
      projectDto,
      {
        withCredentials: true,
      }
    );
  };

  const addColumnToProject = (
    projectId: string,
    columnDto: IUpdateAddColumn
  ) => {
    return put<IUpdateAddColumn, AxiosResponse<void>>(
      bastPath + "/" + projectId + "/AddColumn",
      columnDto,
      {
        withCredentials: true,
      }
    );
  };

  const updateColumn = (projectId: string, columnDto: IUpdateColumnDTO) => {
    return put<IUpdateColumnDTO, AxiosResponse<void>>(
      bastPath + "/" + projectId + "/Column",
      columnDto,
      {
        withCredentials: true,
      }
    );
  };

  const deleteColumn = (projectId: string, columnId: string) => {
    return put<void, AxiosResponse<void>>(
      bastPath + "/" + projectId + "/DeleteColumn/" + columnId,
      undefined,
      {
        withCredentials: true,
      }
    );
  };

  return {
    getAllUserProjects,
    createNewProject,
    getProjectById,
    updateProject,
    addColumnToProject,
    updateColumn,
    deleteColumn,
  };
};

export default useProjectService;
