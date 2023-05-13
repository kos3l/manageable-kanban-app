import {
  ClipboardDocumentListIcon,
  ClockIcon,
  PencilSquareIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { QueryClient, useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import { Team } from "../../models/entities/Team";
import { User } from "../../models/entities/User";
import ActionButton from "../../ui/buttons/ActionButton";
import ProjectCard from "../../ui/cards/ProjectCard";
import UserCard from "../../ui/cards/UserCard";
import WrapperCard from "../../ui/cards/WrapperCard";
import DisplayField from "../../ui/display-field/DisplayField";
import { profileQuery } from "../user/user-root/UserRoot";

// move this to a loader
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

export default function TeamPage() {
  const { id } = useParams();
  const { getTeamById } = useTeamService();

  if (!id) {
    return <>No team id found</>;
  }
  const { data: team } = useQuery(teamByIdQuery(id, getTeamById));

  if (!team) {
    return <>Loading</>;
  }

  team.userModels = team.userModels?.sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  team.projectModels = team.projectModels?.sort((a, b) => b.status - a.status);

  return (
    <div className="flex h-max w-full flex-wrap gap-3 xl:flex-nowrap 2xl:w-3/4">
      <div className="flex h-max w-full flex-col gap-3 xl:basis-80 ">
        <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
          <h1 className="break-word font-serif text-lg tracking-wider">
            {team.name}
          </h1>
          <DisplayField
            label={"Created at"}
            placeholder={"Date not found"}
            value={new Date(team.createdAt).toLocaleDateString()}
            icon={<ClockIcon className="w-6 text-neutral-300"></ClockIcon>}
          ></DisplayField>
          <DisplayField
            label={"Description"}
            placeholder={"No Description"}
            value={team.description}
          ></DisplayField>
        </div>
        <div className="flex w-full flex-wrap gap-4 md:flex-nowrap xl:flex-col">
          <div className="grow basis-full md:basis-1/3">
            <Link to={"./update-members"}>
              <ActionButton
                color="indigo"
                content={"Edit members"}
                icon={
                  <UserPlusIcon className="w-5 text-indigo-500"></UserPlusIcon>
                }
              ></ActionButton>
            </Link>{" "}
          </div>
          <div className="grow basis-full md:basis-1/3">
            <Link to={"./edit"}>
              <ActionButton
                color="indigo"
                content={"Edit Team"}
                icon={
                  <PencilSquareIcon className="w-5 text-indigo-500"></PencilSquareIcon>
                }
              ></ActionButton>
            </Link>{" "}
          </div>
          <div className="grow basis-full md:basis-1/3">
            <ActionButton
              color="red"
              content={"Delete Team"}
              icon={
                <PencilSquareIcon className="w-5 text-red-600"></PencilSquareIcon>
              }
            ></ActionButton>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-wrap-reverse gap-4 sm:grow sm:flex-nowrap">
        <WrapperCard
          name={"Projects"}
          displayEntities={team.projectModels ? team.projectModels : []}
          displayComponent={(project) => (
            <ProjectCard
              project={project}
              teamName={team.name}
              key={project._id}
              icon={
                <ClipboardDocumentListIcon className="w-6 text-indigo-500"></ClipboardDocumentListIcon>
              }
            ></ProjectCard>
          )}
        ></WrapperCard>
        <WrapperCard
          name={"Members"}
          displayEntities={team.userModels ? team.userModels : []}
          displayComponent={(user) => (
            <UserCard
              color="white"
              key={user._id}
              user={user}
              isActionCard={false}
              icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
            ></UserCard>
          )}
        ></WrapperCard>
      </div>
    </div>
  );
}
