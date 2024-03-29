import { AxiosResponse } from "axios";
import { QueryClient, useQuery } from "react-query";
import { Outlet, redirect, useParams } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import { Team } from "../../models/entities/Team";
import QueryKeys from "../../static/QueryKeys";

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

export const loader =
  (
    queryClient: QueryClient,
    getTeamById: (teamId: string) => Promise<AxiosResponse<Team, any>>
  ) =>
  async ({ params }: any) => {
    const query = teamByIdQuery(params.id, getTeamById);
    const invalidated = queryClient.getQueryState(query.queryKey);
    if (invalidated) {
      return await queryClient.fetchQuery(query);
    }
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export const action =
  (
    queryClient: QueryClient,
    deleteTeam: (teamId: string) => Promise<AxiosResponse<void, any>>
  ) =>
  async ({ request, params }: any) => {
    await deleteTeam(params.id);
    queryClient.invalidateQueries({
      queryKey: ["project", params.id],
    });
    queryClient.invalidateQueries({
      queryKey: QueryKeys.allTeams,
    });
    queryClient.invalidateQueries({
      queryKey: QueryKeys.userProfile,
    });
    queryClient.invalidateQueries({
      queryKey: QueryKeys.projectsWithTeams,
    });
    queryClient.invalidateQueries({
      queryKey: QueryKeys.userProjects,
    });
    queryClient.invalidateQueries({
      queryKey: QueryKeys.user,
    });
    queryClient.invalidateQueries({
      queryKey: QueryKeys.statistic,
    });
    return redirect(`/user/teams-overview`);
  };

export default function TeamRootPage() {
  const { id } = useParams();
  const { getTeamById } = useTeamService();

  if (!id) {
    return (
      <div className="flex h-max w-full flex-wrap gap-3 bg-gradient-to-b from-neutral-900 p-4 xl:flex-nowrap 2xl:w-3/4">
        {<>Loading</>}
      </div>
    );
  }
  const { data: team } = useQuery(teamByIdQuery(id, getTeamById));

  return (
    <div className="flex h-max w-full flex-wrap gap-3 bg-gradient-to-b from-neutral-900 p-4 xl:flex-nowrap 2xl:w-3/4">
      {!team ? <>Loading</> : <Outlet />}
    </div>
  );
}
