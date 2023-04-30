import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useAuthService from "../../../hooks/service/useAuthService";
import useTeamService from "../../../hooks/service/useTeamService";
import useAuth from "../../../hooks/useAuth";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { getAllUserTeams } = useTeamService();

  const fetchTeams = useQuery({
    queryKey: ["team"],
    retry: 1,
    queryFn: async () => {
      const response = await getAllUserTeams();
      if (response.status == 401 || response.status == 403) {
        throw new Error("Token expired");
      }
      return response.data;
    },
    onError: (error: any) => {
      navigate("/login", { replace: true });
    },
  });

  return (
    <>
      Hello logged in user!{" "}
      <Link to={"../test"}>
        <span className="ml-1 text-neutral-200/80 underline">Register</span>
      </Link>
      <Link to={"/login"}>
        <span className="ml-1 text-neutral-200/80 underline">login</span>
      </Link>
    </>
  );
}
