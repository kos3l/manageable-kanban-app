import {
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { Link, useParams } from "react-router-dom";
import useProjectService from "../../hooks/service/useProjectService";
import { Project } from "../../models/entities/Project";
import { ProjectStatus } from "../../models/enum/ProjectStatus";
import { ProjectStatusText } from "../../models/enum/ProjectStatusText";
import { colorIndex } from "../../models/util/ColorIndex";
import ActionButton from "../../ui/buttons/ActionButton";
import DisplayField from "../../ui/display-field/DisplayField";
import avatar from "../../assets/avatar.png";
import TeamBanner from "../../ui/banner/TeamBanner";

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

export default function ProjectPage() {
  const { id } = useParams();
  const { getProjectById } = useProjectService();

  if (!id) {
    return <>No team id found</>;
  }
  const { data: project } = useQuery(projectByIdQuery(id, getProjectById));

  if (!project) {
    return <>Loading</>;
  }

  type colorVariants = {
    COMPLETED: string;
    ONGOING: string;
    NOTSTARTED: string;
    OVERDUE: string;
  };

  const labelVariants: colorIndex & colorVariants = {
    COMPLETED:
      "rounded-lg flex justify-center px-2 border border-indigo-500 bg-indigo-700/20 py-1 text-indigo-500",
    ONGOING:
      "rounded-lg flex justify-center px-2 border border-pink-500 bg-pink-800/20 py-1 text-pink-400",
    NOTSTARTED:
      "rounded-lg flex justify-center px-2 border border-neutral-400 bg-neutral-500/20  py-1 text-neutral-300",
    OVERDUE:
      "rounded-lg flex justify-center px-2 border border-red-700 bg-red-800/20 py-1 text-red-700",
  };

  return (
    <div className="flex h-max w-full flex-wrap gap-3 p-4  xl:flex-nowrap 2xl:w-3/4">
      <div className="flex h-max w-full flex-col gap-3 xl:basis-96">
        <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
          <div className={`${labelVariants[ProjectStatus[project.status]]}`}>
            <p className="truncate font-serif text-base font-medium tracking-wider ">
              {
                ProjectStatusText[
                  ProjectStatus[
                    project.status
                  ] as keyof typeof ProjectStatusText
                ]
              }
            </p>
          </div>
          <h1 className="break-word font-serif text-lg tracking-wider">
            {project.name}
          </h1>
          <DisplayField
            color="white"
            label={"Start Date"}
            placeholder={"Date not found"}
            value={new Date(project.startDate).toLocaleDateString()}
            icon={<ClockIcon className="w-6 text-neutral-300"></ClockIcon>}
          ></DisplayField>
          <DisplayField
            color="white"
            label={"End Date"}
            placeholder={"Date not found"}
            icon={
              <CheckCircleIcon className="w-6 text-neutral-300"></CheckCircleIcon>
            }
            value={new Date(project.endDate).toLocaleDateString()}
          ></DisplayField>
          <DisplayField
            color="white"
            label={"Description"}
            placeholder={"No Description"}
            value={project.description}
          ></DisplayField>
        </div>
        <div className="flex w-full flex-wrap gap-3 md:flex-nowrap xl:flex-col">
          <div className="grow basis-full md:basis-1/3">
            <Link to={"./update-members"}>
              <ActionButton
                color="indigo"
                content={"Complete"}
                icon={<CheckIcon className="w-5 text-indigo-500"></CheckIcon>}
              ></ActionButton>
            </Link>
          </div>
          <div className="grow basis-full md:basis-1/3">
            <Link to={"./kanban"}>
              <ActionButton
                color="indigo"
                content={"Kanban"}
                icon={
                  <ListBulletIcon className="w-5 text-indigo-500"></ListBulletIcon>
                }
              ></ActionButton>
            </Link>{" "}
          </div>
          <div className="grow basis-full md:basis-1/3">
            <Link to={"./edit"}>
              <ActionButton
                color="indigo"
                content={"Edit Project"}
                icon={
                  <PencilSquareIcon className="w-5 text-indigo-500"></PencilSquareIcon>
                }
              ></ActionButton>
            </Link>{" "}
          </div>
          <div className="grow basis-full md:basis-1/3">
            <ActionButton
              color="red"
              content={"Delete Project"}
              icon={<TrashIcon className="w-5 text-red-600"></TrashIcon>}
            ></ActionButton>
          </div>
        </div>
      </div>
      <div className="flex h-max w-full flex-col gap-2 rounded-lg border border-neutral-800 sm:grow sm:flex-nowrap">
        <div className="w-full">
          <TeamBanner team={project.team[0]}></TeamBanner>
        </div>
        {project.techStack && project.techStack.length > 0 ? (
          <div className="flex h-max w-full items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-2">
            <>
              <p className="ml-2 mt-1 tracking-wider text-neutral-500">
                Tools stack
              </p>
              {project.techStack.map((tech, index) => {
                return (
                  <div
                    key={index}
                    className="w-max cursor-pointer rounded border border-pink-500 bg-pink-600/30 px-2"
                  >
                    <p className="mt-1 text-sm text-pink-500">{tech}</p>{" "}
                  </div>
                );
              })}
            </>
          </div>
        ) : (
          <></>
        )}
        {/* Tasks */}
        <div className="flex h-max w-full items-center gap-2">
          <div className="flex h-max grow items-center gap-2">
            <div className="flex h-max w-full items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-2"></div>
          </div>
          <div className="flex h-max grow items-center gap-2">
            <div className="flex h-max w-full items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
