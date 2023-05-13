import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import { Team } from "../../models/entities/Team";

const teamByIdQuery = (
  teamId: string,
  getTeamById: (teamId: string) => Promise<AxiosResponse<Team, any>>
) => ({
  queryKey: ["team", teamId],
  queryFn: async () => {
    const response = await getTeamById(teamId);
    if (response.status == 403) {
      throw new Error("Token expired");
    }
    if (!response) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return response.data;
  },
});

export default function TeamPage() {
  const { id } = useParams();
  const { getTeamById } = useTeamService();

  if (!id) {
    return <>No team id found</>;
  }

  const { data: team } = useQuery(teamByIdQuery(id, getTeamById));

  return (
    <div className=" flex w-full gap-3">
      <div className="flex basis-80 flex-col rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
        <h1 className="font-serif text-lg tracking-wider">{team?.name}</h1>
      </div>
      <div className="flex grow rounded-lg border border-neutral-600"></div>
      <div className="flex grow rounded-lg border border-neutral-600"></div>
    </div>
  );
}
