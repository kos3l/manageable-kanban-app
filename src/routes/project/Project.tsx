import {
  CheckCircleIcon,
  ClockIcon,
  UserPlusIcon,
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
    <div className="flex h-max w-full flex-wrap gap-3 xl:flex-nowrap 2xl:w-3/4">
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
            label={"Start Date"}
            placeholder={"Date not found"}
            value={new Date(project.startDate).toLocaleDateString()}
            icon={<ClockIcon className="w-6 text-neutral-300"></ClockIcon>}
          ></DisplayField>
          <DisplayField
            label={"End Date"}
            placeholder={"Date not found"}
            icon={
              <CheckCircleIcon className="w-6 text-neutral-300"></CheckCircleIcon>
            }
            value={new Date(project.endDate).toLocaleDateString()}
          ></DisplayField>
          <DisplayField
            label={"Description"}
            placeholder={"No Description"}
            value={project.description}
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
          {/* <div className="grow basis-full md:basis-1/3">
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
          onClick={() => {
            const warning = confirm(
              "Are you sure you want to delete this team?"
            );
            if (warning) {
              submit(null, { method: "delete" });
            }
          }}
          icon={
            <PencilSquareIcon className="w-5 text-red-600"></PencilSquareIcon>
          }
        ></ActionButton>
      </div> */}
        </div>
      </div>
      <div className="flex w-full flex-wrap-reverse gap-4 rounded-lg border border-neutral-800 sm:grow sm:flex-nowrap">
        <div className="flex h-max w-full items-center gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
          <div className="w-20 overflow-hidden rounded-lg border border-neutral-600  sm:border-0 ">
            <img src={avatar} alt="" className="h-full w-full object-contain" />
          </div>
          <div className="flex w-max flex-col gap-2">
            <DisplayField
              label={"Team:"}
              value={project.team[0].name}
              placeholder={""}
            ></DisplayField>
          </div>
        </div>
        {/* <WrapperCard
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
    ></WrapperCard> */}
      </div>
    </div>
  );
}
