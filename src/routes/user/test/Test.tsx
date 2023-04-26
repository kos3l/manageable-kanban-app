import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import useTeamService from "../../../hooks/service/useTeamService";

export default function Test() {
  const navigate = useNavigate();
  const { getAllUserTeams } = useTeamService();

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["team"],
    queryFn: () => {
      return getAllUserTeams();
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
