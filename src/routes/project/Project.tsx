import {
  CheckCircleIcon,
  CheckIcon,
  ClockIcon,
  ListBulletIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link, Navigate, redirect, useParams } from "react-router-dom";
import useProjectService from "../../hooks/service/useProjectService";
import { Project } from "../../models/entities/Project";
import { ProjectStatus } from "../../models/enum/ProjectStatus";
import { ProjectStatusText } from "../../models/enum/ProjectStatusText";
import { colorIndex } from "../../models/util/ColorIndex";
import ActionButton from "../../ui/buttons/ActionButton";
import DisplayField from "../../ui/display-field/DisplayField";
import TeamBanner from "../../ui/banner/TeamBanner";
import useTaskService from "../../hooks/service/useTaskService";
import { DateHelper } from "../../util/helpers/DateHelper";
import TasksPerColumnChart from "../../ui/charts/TasksPerColumnChart";
import TaskListCard from "../../ui/cards/TaskListCard";

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
  const queryClient = useQueryClient();
  const { getProjectById, completeProject, deleteProject } =
    useProjectService();
  const { getTasksByProjectId } = useTaskService();

  if (!id) {
    return <>No team id found</>;
  }

  const { data: tasks } = useQuery({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const response = await getTasksByProjectId(id);
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

  const completeProjectMutation = useMutation({
    mutationFn: () => {
      return completeProject(id);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["project", id],
      });
    },
  });

  const deleteProjectMutation = useMutation({
    mutationFn: () => {
      return deleteProject(id);
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: ["project", id],
      });
      queryClient.invalidateQueries({
        queryKey: ["projects"],
      });
    },
  });

  const { data: project } = useQuery(projectByIdQuery(id, getProjectById));

  if (!project) {
    return <>Loading</>;
  }

  const daysLeft =
    project.status == ProjectStatus.ONGOING
      ? DateHelper.differenceInDays(new Date(project.endDate), new Date())
      : 0;

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

  function handleDeleteProject() {
    const warning = confirm(
      "This action will delete the project. Do you want to proceed?"
    );
    if (warning) {
      deleteProjectMutation.mutate();
    }
  }

  if (deleteProjectMutation.isSuccess) {
    return <Navigate to={"/user/projects-overview"}></Navigate>;
  }

  return (
    <div className="flex h-max w-full 2xl:justify-center">
      <div className="flex h-max w-full flex-wrap gap-2 p-4 md:flex-nowrap md:justify-start lg:gap-3  2xl:w-3/4 ">
        <div className="flex h-max w-full flex-col gap-3 md:basis-96">
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
            <div className="flex w-max flex-col gap-2 sm:flex-row md:flex-col">
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
            </div>
            <DisplayField
              color="white"
              label={"Description"}
              placeholder={"No Description"}
              value={project.description}
            ></DisplayField>
          </div>
          <div className="flex h-max w-full flex-wrap gap-2 md:flex-col md:flex-nowrap">
            <div className=" grow">
              <ActionButton
                onClick={() => completeProjectMutation.mutate()}
                color="indigo"
                content={"Complete"}
                icon={<CheckIcon className="w-5 text-indigo-500"></CheckIcon>}
              ></ActionButton>
            </div>
            <div className="grow">
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
            <div className="grow">
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
            <div className="grow">
              <ActionButton
                onClick={() => handleDeleteProject()}
                color="red"
                content={"Delete Project"}
                icon={<TrashIcon className="w-5 text-red-600"></TrashIcon>}
              ></ActionButton>
            </div>
          </div>
        </div>
        <div className="flex h-max w-full flex-col gap-2 sm:flex-nowrap md:grow">
          <div className="w-full">
            <TeamBanner team={project.team[0]}></TeamBanner>
          </div>
          {project.techStack && project.techStack.length > 0 ? (
            <div className="flex h-max w-full flex-col items-start justify-center gap-1 rounded-lg border border-neutral-600 bg-neutral-800/50 p-2 sm:flex-row sm:items-center sm:justify-start sm:gap-2">
              <p className="mr-2 min-w-max tracking-wider text-neutral-500 sm:mt-1 sm:ml-2">
                Tools stack
              </p>
              <div className="flex h-max flex-wrap gap-2">
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
              </div>
            </div>
          ) : (
            <></>
          )}
          {tasks && tasks.length > 0 ? (
            <div className="flex h-max w-full flex-col items-start gap-2 xl:flex-row">
              <div className="flex h-max w-full flex-col items-start gap-2 xl:w-3/5">
                <div className="flex h-max w-full items-center gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
                  <div className="flex grow flex-col border-r border-neutral-600">
                    <p className="text-sm text-neutral-500">Total Tasks:</p>
                    <p className="font-serif text-2xl font-bold tracking-wider">
                      {tasks.length}
                    </p>
                  </div>
                  <div className="flex grow flex-col border-r border-neutral-600">
                    <p className="text-sm text-neutral-500">
                      Total Assigned Tasks:
                    </p>
                    <p className="font-serif text-2xl font-bold tracking-wider">
                      {tasks.filter((task) => task.userIds.length > 0).length}
                    </p>
                  </div>
                  <div className="flex grow flex-col">
                    <p className="text-sm text-neutral-500">Days Left:</p>
                    <p className="font-serif text-2xl font-bold tracking-wider">
                      {daysLeft}
                    </p>
                  </div>
                </div>
                <div className="flex h-max w-full rounded-lg border border-neutral-600 bg-neutral-800/50">
                  <TasksPerColumnChart
                    label="Tasks Per Column"
                    columns={project.columns}
                  ></TasksPerColumnChart>
                </div>
              </div>
              <div className="flex h-full w-full flex-col items-center gap-2 xl:w-2/5">
                <TaskListCard
                  title="Unassigned Taskss"
                  tasks={tasks.filter((task) => task.userIds.length == 0)}
                ></TaskListCard>
                <TaskListCard
                  title="Overdue Tasks"
                  tasks={tasks.filter(
                    (task) => new Date() > new Date(task.endDate)
                  )}
                ></TaskListCard>
              </div>
            </div>
          ) : (
            <div className="flex h-64 w-full items-center justify-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800/20 p-2">
              <ListBulletIcon className="w-8"></ListBulletIcon>
              <p className="mt-1 text-2xl tracking-wider text-neutral-600">
                No tasks yet
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
