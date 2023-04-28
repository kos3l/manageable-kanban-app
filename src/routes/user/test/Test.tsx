import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import useTeamService from "../../../hooks/service/useTeamService";

export default function Test() {
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
      test!{" "}
      <Link to={"../user-dashboard"}>
        <span className="ml-1 text-neutral-200/80 underline">Register</span>
      </Link>
    </>
  );
}
