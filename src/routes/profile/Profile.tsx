import { useLoaderData, useRouteLoaderData } from "react-router-dom";
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

const projectsWithTeamsQuery = (
  getAllUserProjects: () => Promise<AxiosResponse<Project[], any>>
) => ({
  queryKey: ["projects", "teams", "profile"],
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

export default function Profile() {
  const user = useRouteLoaderData("userRoot") as User;
  const { getAllUserProjects } = useProjectService();
  const { data: projects } = useQuery(
    projectsWithTeamsQuery(getAllUserProjects)
  );

  const distinctTeamOnProjects = projects
    ? [
        ...new Map(
          projects.map((project) => [project.teamId.toString(), project])
        ).values(),
      ]
    : [];

  const teams = distinctTeamOnProjects.map((project) => project.team[0]);

  console.log(teams);
  return (
    <div className="flex h-max w-full flex-wrap gap-4 sm:h-full sm:flex-nowrap">
      <div className="flex h-80 w-full grow-0 flex-col gap-3 sm:h-full sm:basis-96 md:basis-64 lg:basis-72">
        <div className="w-full overflow-hidden rounded-lg border border-neutral-600 sm:border-0 ">
          <img src={avatar} alt="" className="h-full w-full object-contain" />
        </div>
        <ActionButton
          content={"Edit Profile"}
          icon={
            <PencilSquareIcon className="w-5 text-indigo-500"></PencilSquareIcon>
          }
        ></ActionButton>
      </div>
      <div className="flex grid w-full grow-0 grid-cols-4 gap-3 sm:grow 2xl:h-max">
        <div className="col-span-4 flex flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3 2xl:h-max">
          <h1 className="text-xl">{user.firstName + " " + user.lastName}</h1>
          <div className="flex w-full items-center gap-2">
            <div className="flex basis-24">
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
            <div className="flex grow truncate">
              <DisplayField
                label={"Bio"}
                placeholder="No description yet"
                value={user.bio}
              ></DisplayField>
            </div>
          </div>
        </div>
        <div className="col-span-4 flex h-max max-h-full grow flex-col gap-3 rounded-lg border border-neutral-600 p-3 lg:col-span-2">
          <div className="flex w-full items-center justify-between">
            <p className="font-serif tracking-wider">Teams</p>
            <p className="text-xl font-medium text-indigo-500">
              {teams?.length}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            {teams.map((team, index) => {
              return (
                <div
                  className="col-span-6 sm:col-span-3 md:col-span-2"
                  key={index}
                >
                  <TeamCard
                    team={team}
                    icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
                  ></TeamCard>
                </div>
              );
            })}
          </div>
        </div>
        <div className="col-span-4 flex h-max max-h-full grow flex-col gap-3 overflow-scroll rounded-lg border border-neutral-600 p-3 lg:col-span-2">
          <div className="flex w-full items-center justify-between">
            <p className="font-serif tracking-wider">Projects</p>
            <p className="text-xl font-medium text-indigo-500">
              {projects?.length}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3">
            {projects?.map((project, index) => {
              return (
                <ProjectCard
                  key={index}
                  project={project}
                  icon={
                    <ClipboardDocumentListIcon className="w-6 text-indigo-500"></ClipboardDocumentListIcon>
                  }
                ></ProjectCard>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
