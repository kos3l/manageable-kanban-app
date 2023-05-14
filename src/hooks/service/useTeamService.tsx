import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";
import { IUpdateTeamUsersDTO } from "../../models/dto/team/IUpdateTeamUsersDTO";
import { IUpdateTeamDTO } from "../../models/dto/team/IUpdateTeamDTO";

const useTeamService = () => {
  const { post, get, put, remove } = useHttp();
  const bastPath = "/api/team";

  const getAllUserTeams = () => {
    return get<void, AxiosResponse<Team[]>>(bastPath, {
      withCredentials: true,
    });
  };

  const getTeamById = (teamId: string) => {
    return get<void, AxiosResponse<Team>>(bastPath + "/" + teamId, {
      withCredentials: true,
    });
  };

  const createNewTeam = (teamDto: ICreateTeamDTO) => {
    return post<ICreateTeamDTO, AxiosResponse<Team>>(bastPath, teamDto, {
      withCredentials: true,
    });
  };

  const updateTeamMembers = (teamId: string, teamDto: IUpdateTeamUsersDTO) => {
    return put<IUpdateTeamUsersDTO, AxiosResponse<void>>(
      bastPath + "/" + teamId + "/UpdateMembers",
      teamDto,
      {
        withCredentials: true,
      }
    );
  };

  const updateTeam = (teamId: string, teamDto: IUpdateTeamDTO) => {
    return put<IUpdateTeamDTO, AxiosResponse<void>>(
      bastPath + "/" + teamId,
      teamDto,
      {
        withCredentials: true,
      }
    );
  };

  const deleteTeam = (teamId: string) => {
    return remove<void, AxiosResponse<void>>(bastPath + "/" + teamId, {
      withCredentials: true,
    });
  };

  return {
    getAllUserTeams,
    getTeamById,
    createNewTeam,
    updateTeamMembers,
    updateTeam,
    deleteTeam,
  };
};

export default useTeamService;
