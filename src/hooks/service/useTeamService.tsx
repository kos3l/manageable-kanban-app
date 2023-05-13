import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";
import { IUpdateTeamUsersDTO } from "../../models/dto/team/IUpdateTeamUsersDTO";

const useTeamService = () => {
  const { post, get, put } = useHttp();
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

  return { getAllUserTeams, getTeamById, createNewTeam, updateTeamMembers };
};

export default useTeamService;
