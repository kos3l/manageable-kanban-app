import { AxiosResponse } from "axios";
import { QueryClient, useQuery } from "react-query";
import { Outlet, useParams } from "react-router-dom";
import useProjectService from "../../hooks/service/useProjectService";
import { Project } from "../../models/entities/Project";

const projectByIdQuery = (
  projectId: string,
  getProjectById: (teamId: string) => Promise<AxiosResponse<Project, any>>
) => ({
  queryKey: ["project", projectId],
  queryFn: async () => {
    const response = await getProjectById(projectId);
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
    getProjectById: (projectId: string) => Promise<AxiosResponse<Project, any>>
  ) =>
  async ({ params }: any) => {
    const query = projectByIdQuery(params.id, getProjectById);
    const invalidated = queryClient.getQueryState(query.queryKey);
    if (invalidated) {
      return await queryClient.fetchQuery(query);
    }
    return (
      queryClient.getQueryData(query.queryKey) ??
      (await queryClient.fetchQuery(query))
    );
  };

export default function ProjectRoot() {
  const { id } = useParams();
  const { getProjectById } = useProjectService();

  if (!id) {
    return <>No team id found</>;
  }
  const { data: project } = useQuery(projectByIdQuery(id, getProjectById));

  if (!project) {
    return <>Loading</>;
  }

  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
}
