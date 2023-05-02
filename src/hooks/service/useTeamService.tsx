import { AxiosResponse } from "axios";
import { ICreateLoginDTO } from "../../models/dto/user/ICreateLoginDTO";
import { IAccessToken } from "../../auth/context/AuthContext";
import useHttp from "../useHttp";
import { Team } from "../../models/entities/Team";

const useTeamService = () => {
  const { post, get } = useHttp();
  const bastPath = "/api/team";

  const getAllUserTeams = () => {
    return get<void, AxiosResponse<Team[]>>(bastPath);
  };

  return { getAllUserTeams };
};

export default useTeamService;
