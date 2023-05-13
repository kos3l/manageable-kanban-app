import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";

const useTeamService = () => {
  const { post, get } = useHttp();
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

  return { getAllUserTeams, getTeamById, createNewTeam };
};

export default useTeamService;
