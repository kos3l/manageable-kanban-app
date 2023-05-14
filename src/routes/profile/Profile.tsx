import {
  Link,
  useLoaderData,
  useRevalidator,
  useRouteLoaderData,
} from "react-router-dom";
import { User } from "../../models/entities/User";
import avatar from "../../assets/avatar.png";
import ActionButton from "../../ui/buttons/ActionButton";
import {
  CakeIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import DisplayField from "../../ui/display-field/DisplayField";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { Project } from "../../models/entities/Project";
import useProjectService from "../../hooks/service/useProjectService";
import ProjectCard from "../../ui/cards/ProjectCard";
import TeamCard from "../../ui/cards/TeamCard";
import { ReactNode, useEffect } from "react";
import useUserService from "../../hooks/service/useUserService";
import WrapperCard from "../../ui/cards/WrapperCard";
import useTeamService from "../../hooks/service/useTeamService";
import { Team } from "../../models/entities/Team";

const projectsWithTeamsQuery = (
  getAllUserProjects: () => Promise<AxiosResponse<Project[], any>>
) => ({
  queryKey: ["projects", "teams"],
  queryFn: async () => {
    const response = await getAllUserProjects();
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

const profileQuery = (
  getUserProfileQuery: () => Promise<AxiosResponse<User, any>>
) => ({
  queryKey: ["profile"],
  queryFn: async () => {
    const response = await getUserProfileQuery();
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

const getAllTeams = (
  getAllUserTeams: () => Promise<AxiosResponse<Team[], any>>
) => ({
  queryKey: ["team"],
  queryFn: async () => {
    const response = await getAllUserTeams();
    if (response.status == 401 || response.status == 403) {
      throw new Error("Token expired");
    }

    return response.data;
  },
});

export default function ProfilePage() {
  const { getAllUserProjects } = useProjectService();
  const { getLoggedInUserProfile } = useUserService();
  const { getAllUserTeams } = useTeamService();

  const { data: user } = useQuery(profileQuery(getLoggedInUserProfile));
  const { data: projects } = useQuery(
    projectsWithTeamsQuery(getAllUserProjects)
  );
  const { data: teams } = useQuery(getAllTeams(getAllUserTeams));

  if (!user) {
    return <>Loading</>;
  }

  return (
    <div className=" flex h-max w-full flex-wrap gap-4 sm:h-full sm:flex-nowrap 2xl:w-2/3">
      <div className="flex h-80 w-full grow-0 flex-col gap-3  sm:h-full sm:basis-96 md:basis-64 lg:basis-72">
        <div className="w-full overflow-hidden rounded-lg border border-neutral-600  sm:border-0 ">
          <img src={avatar} alt="" className="h-full w-full object-contain" />
        </div>
        <Link to={"./edit"}>
          <ActionButton
            color="indigo"
            content={"Edit Profile"}
            icon={
              <PencilSquareIcon className="w-5 text-indigo-500"></PencilSquareIcon>
            }
          ></ActionButton>
        </Link>
      </div>
      <div className="flex grid h-max w-full grow-0 grid-cols-4 gap-3 sm:grow 2xl:h-max">
        <div className="col-span-4 flex h-max flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3 2xl:h-max">
          <h1 className="text-xl">{user.firstName + " " + user.lastName}</h1>
          <div className="flex h-max w-full flex-wrap items-start gap-2 sm:flex-nowrap">
            <div className="flex w-full sm:min-w-[rem] sm:basis-72">
              <DisplayField
                label={"Birthday"}
                icon={<CakeIcon className="w-5 text-neutral-300"></CakeIcon>}
                placeholder="Missing data"
                value={new Date(user.birthdate).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                })}
              ></DisplayField>
            </div>
            <div className="mt-0.5 flex w-full sm:w-max sm:grow">
              <DisplayField
                label={"Bio"}
                placeholder="No description yet"
                value={user.bio}
              ></DisplayField>
            </div>
          </div>
        </div>
        <div className="col-span-4 flex max-h-full grow  lg:col-span-2">
          <WrapperCard
            name={"Teams"}
            displayEntities={teams ? teams : []}
            displayComponent={(team) => (
              <TeamCard
                team={team}
                key={team._id}
                icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
              ></TeamCard>
            )}
          ></WrapperCard>
        </div>
        <div className="col-span-4 flex  max-h-full grow  gap-3 lg:col-span-2">
          <WrapperCard
            name={"Projects"}
            displayEntities={
              projects ? projects.sort((a, b) => b.status - a.status) : []
            }
            displayComponent={(project) => (
              <ProjectCard
                key={project._id}
                project={project}
                icon={
                  <ClipboardDocumentListIcon className="w-6 text-indigo-500"></ClipboardDocumentListIcon>
                }
              ></ProjectCard>
            )}
          ></WrapperCard>
        </div>
      </div>
    </div>
  );
}
