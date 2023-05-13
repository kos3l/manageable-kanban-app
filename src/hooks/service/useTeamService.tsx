import { AxiosResponse } from "axios";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";

const useTeamService = () => {
  const { post, get } = useHttp();
  const bastPath = "/api/team";

  const getAllUserTeams = () => {
    return get<void, AxiosResponse<Team[]>>(bastPath);
  };

  const getTeamById = (teamId: string) => {
    return get<void, AxiosResponse<Team>>(bastPath + "/" + teamId);
  };

  return { getAllUserTeams, getTeamById };
};

export default useTeamService;
