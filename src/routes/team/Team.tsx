import {
  ClipboardDocumentListIcon,
  ClockIcon,
  PencilSquareIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { ReactNode } from "react";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import { Team } from "../../models/entities/Team";
import ActionButton from "../../ui/buttons/ActionButton";
import ProjectCard from "../../ui/cards/ProjectCard";
import UserCard from "../../ui/cards/UserCard";
import WrapperCard from "../../ui/cards/WrapperCard";
import DisplayField from "../../ui/display-field/DisplayField";

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

  if (!team) {
    return <>Loading</>;
  }

  team.userModels = team.userModels?.sort((a, b) =>
    a.firstName.localeCompare(b.firstName)
  );

  team.projectModels = team.projectModels?.sort((a, b) => b.status - a.status);

  return (
    <div className="flex w-full flex-wrap gap-3 xl:flex-nowrap">
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

        <Link to={"./addMemers"}>
          <div className="w-full sm:w-56 xl:w-full">
            <ActionButton
              color="indigo"
              content={"Add members"}
              icon={
                <UserPlusIcon className="w-5 text-indigo-500"></UserPlusIcon>
              }
            ></ActionButton>
          </div>
        </Link>
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
              key={user._id}
              user={user}
              icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
            ></UserCard>
          )}
        ></WrapperCard>
      </div>
    </div>
  );
}
