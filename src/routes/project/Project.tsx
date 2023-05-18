import {
  Bars3Icon,
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
import TeamBanner from "../../ui/banner/TeamBanner";
import useTaskService from "../../hooks/service/useTaskService";
import { DateHelper } from "../../util/helpers/DateHelper";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Chart } from "chart.js";
ChartJS.register(ArcElement, Tooltip, Legend);

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
  const { getTasksByProjectId } = useTaskService();
  if (!id) {
    return <>No team id found</>;
  }

  type tailwindColor = { name: string; hex: string };
  const colors: tailwindColor[] = [
    { name: "pink", hex: "#db2777" },
    { name: "violet", hex: "#7c3aed" },
    { name: "indigo", hex: "#4338ca" },
    { name: "green", hex: "#16a34a" },
    { name: "amber", hex: "#f59e0b" },
    { name: "red", hex: "#b91c1c" },
    { name: "cyan", hex: "#06b6d4" },
    { name: "white", hex: "#d4d4d4" },
    { name: "red-l", hex: "#fca5a5" },
    { name: "red-d", hex: "#7f1d1d" },
    { name: "yellow-l", hex: "#fef3c7" },
    { name: "green-l", hex: "#d9f99d" },
    { name: "green-d", hex: "#365314" },
    { name: "emerald-d", hex: "#34d399" },
    { name: "blue-d", hex: "#1e3a8a" },
    { name: "rose", hex: "#fda4af" },
    { name: "rose-d", hex: "#881337" },
    { name: "fuchsia", hex: "#d946ef" },
    { name: "purple", hex: "#c084fc" },
    { name: "purple-d", hex: "#4c1d95" },
    { name: "lime", hex: "#ecfccb" },
  ];

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

  type columnsChartData = {
    id: number;
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  };

  const { data: project } = useQuery(projectByIdQuery(id, getProjectById));

  if (!project) {
    return <>Loading</>;
  }

  const toRGBA = (color: string) => {
    const { style } = new Option();
    style.color = color;
    return style.color.replace(")", ", 0.2)").replace("rgb", "rgba");
  };

  const chartColumns: columnsChartData = {
    id: 1,
    label: "Tasks",
    data: project.columns.map((col) => col.tasks.length),
    backgroundColor: colors.map((col) => toRGBA(col.hex)),
    borderColor: colors.map((col) => col.hex),
    borderWidth: 1,
  };

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
            <div className="flex w-max flex-row gap-2 md:flex-col">
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
              <Link to={"./update-members"}>
                <ActionButton
                  color="indigo"
                  content={"Complete"}
                  icon={<CheckIcon className="w-5 text-indigo-500"></CheckIcon>}
                ></ActionButton>
              </Link>
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
                color="red"
                content={"Delete Project"}
                icon={<TrashIcon className="w-5 text-red-600"></TrashIcon>}
              ></ActionButton>
            </div>
          </div>
        </div>
        <div className="flex h-max w-full flex-col gap-2 rounded-lg border border-neutral-800 sm:flex-nowrap md:grow">
          <div className="w-full">
            <TeamBanner team={project.team[0]}></TeamBanner>
          </div>
          {project.techStack && project.techStack.length > 0 ? (
            <div className="flex h-max w-full flex-wrap items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-2">
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
            </div>
          ) : (
            <></>
          )}
          {tasks && tasks.length > 0 ? (
            <div className="flex h-max w-full items-center gap-2">
              <div className="flex h-max grow flex-col items-center gap-2">
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
                <div className="flex h-max w-full flex-col items-center justify-center gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
                  <div className="flex w-full text-neutral-600">
                    <p>Tasks per column</p>
                  </div>
                  <div className="flex h-max w-[40%]">
                    <Doughnut
                      data={{
                        labels: project.columns.map((col) => col.name),
                        datasets: [chartColumns],
                      }}
                      options={{
                        responsive: true,
                        plugins: {
                          legend: {
                            display: false,
                          },
                        },
                      }}
                    ></Doughnut>
                  </div>
                  <div className="mt-4 flex h-max w-full flex-wrap gap-3">
                    {project.columns.map((col, index) => {
                      return (
                        <div
                          className="basis-max flex grow items-center gap-2 rounded-lg px-3 py-2 leading-4"
                          style={{
                            backgroundColor: toRGBA(colors[index].hex),
                            border: "1px solid" + colors[index].hex,
                          }}
                        >
                          <p className="traking-wider font-serif text-sm">
                            {col.name}
                          </p>
                          <p className="mt-0.5 text-lg font-medium">
                            {col.tasks.length}
                          </p>{" "}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex h-max grow items-center gap-2">
                <div className="flex h-max w-full items-center gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-2"></div>
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
function resolveConfig(tailwindConfig: any) {
  throw new Error("Function not implemented.");
}
