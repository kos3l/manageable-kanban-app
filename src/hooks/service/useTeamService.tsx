import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";

const useTeamService = () => {
  const { post, get } = useHttp();
  const bastPath = "/api/team";

  const getAllUserTeams = () => {
    return get<void, AxiosResponse<Team[]>>(bastPath);
  };

  const getTeamById = (teamId: string) => {
    return get<void, AxiosResponse<Team>>(bastPath + "/" + teamId);
  };

  const createNewTeam = (teamDto: ICreateTeamDTO) => {
    return post<ICreateTeamDTO, AxiosResponse<Team>>(bastPath, teamDto);
  };

  return { getAllUserTeams, getTeamById, createNewTeam };
};

export default useTeamService;
