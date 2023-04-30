import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";

export default function TeamsOverview() {
  const navigate = useNavigate();
  const { getAllUserTeams } = useTeamService();

  const { data } = useQuery({
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
      <div className="">
        {data ? (
          <>
            {data.map((team) => {
              return (
                <div className="w-44 rounded border border-neutral-600 bg-neutral-800/40 p-2">
                  <p>{team.name}</p>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
}
