import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import useProjectService from "../../../hooks/service/useProjectService";
import useTaskService from "../../../hooks/service/useTaskService";
import { Column } from "../../../models/entities/Column";
import { Project } from "../../../models/entities/Project";
import { Task } from "../../../models/entities/Task";
import { ProjectStatus } from "../../../models/enum/ProjectStatus";
import QueryKeys from "../../../static/QueryKeys";
import ProjectCard from "../../../ui/cards/ProjectCard";
import TaskListCard from "../../../ui/cards/TaskListCard";
import WrapperCard from "../../../ui/cards/WrapperCard";
import TasksPerColumnChart from "../../../ui/charts/TasksPerColumnChart";

const projectsWithTeamsQuery = (
  getAllUserProjects: () => Promise<AxiosResponse<Project[], any>>
) => ({
  queryKey: QueryKeys.projectsWithTeams,
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

const tasksForUserQuery = (
  getTasksByUser: () => Promise<AxiosResponse<Task[], any>>
) => ({
  queryKey: QueryKeys.statistic,
  queryFn: async () => {
    const response = await getTasksByUser();
    if (response.status == 403) {
      throw new Error("Token expired");
    }
    if (!response) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }

    let fetchedTasks = response.data;
    const filteredTasks = fetchedTasks.filter(
      (task) =>
        task.project && task.project[0].status !== ProjectStatus.COMPLETED
    );

    return filteredTasks;
  },
});

export default function UserDashboardPage() {
  const { getAllUserProjects } = useProjectService();
  const { getTasksByUser } = useTaskService();

  const { data: projects } = useQuery(
    projectsWithTeamsQuery(getAllUserProjects)
  );
  const { data: tasks } = useQuery(tasksForUserQuery(getTasksByUser));

  if (!projects) {
    return (
      <div className="flex h-max w-full flex-col gap-3 bg-gradient-to-b from-neutral-900 p-4 2xl:w-3/4">
        <h1 className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent ">
          Welcome to your dashboard!
        </h1>
      </div>
    );
  }

  function getMergedColumns() {
    if (projects && projects.length > 0) {
      // Get all columns which have tasks assigned to the logged in user
      const allColumns = projects
        .filter((project) => project.status !== ProjectStatus.COMPLETED)
        .map((project) => project.columns);

      const joinedColumns =
        allColumns && allColumns.length > 0
          ? allColumns
              .reduce((acc, val) => {
                return acc.concat(val);
              })
              .filter((col) => tasks?.find((task) => task.columnId == col._id))
          : [];

      // Merge columns named the same into one column and filter their tasks to leave only ones assigned to the current user
      const mergedColumns =
        joinedColumns && joinedColumns.length > 0
          ? (Array.from(new Set(joinedColumns.map((col) => col.name))).map(
              (name) => {
                return {
                  _id: joinedColumns.find((col) => col.name === name)?._id,
                  name: name,
                  tasks: joinedColumns
                    .filter((col) => col.name === name)
                    .map((edition) => edition.tasks)
                    .reduce((acc, val) => {
                      return acc.concat(val);
                    })
                    .filter((task) => tasks?.find((t) => t._id == task)),
                };
              }
            ) as Column[])
          : [];

      return mergedColumns;
    } else {
      return [];
    }
  }

  function getOverdueTasks() {
    if (tasks && tasks.length > 0) {
      const tasksArray = tasks
        .filter((task) => new Date() > new Date(task.endDate))
        .sort((a, b) => (new Date(b.endDate) < new Date(a.endDate) ? -1 : 1));

      return tasksArray;
    } else {
      return [];
    }
  }

  function getUpcomingDeadlinesTasks() {
    if (tasks && tasks.length > 0) {
      const tasksArray = tasks
        .filter((task) => new Date() < new Date(task.endDate))
        .sort((a, b) => (new Date(b.endDate) < new Date(a.endDate) ? 1 : -1));
      return tasksArray;
    } else {
      return [];
    }
  }

  return (
    <div className="flex h-max w-full flex-col gap-3 bg-gradient-to-b from-neutral-900 p-4 2xl:w-3/4">
      <h1 className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent ">
        Welcome to your dashboard!
      </h1>
      <div className="flex h-max w-full flex-col gap-3 sm:flex-row">
        <div className="flex h-max w-full sm:h-[38rem] sm:w-2/5">
          <WrapperCard
            minHeight={true}
            name={"Projects"}
            displayEntities={
              projects
                ? projects
                    .filter(
                      (project) => project.status !== ProjectStatus.COMPLETED
                    )
                    .sort((a, b) => b.status - a.status)
                : []
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
        <div className="flex h-max w-full flex-col gap-3 sm:w-3/5">
          <div className="flex h-max w-full gap-3 rounded-lg border border-neutral-600 bg-neutral-800/20 p-1">
            <TasksPerColumnChart
              label="Your Tasks Per Column"
              columns={getMergedColumns()}
            ></TasksPerColumnChart>
          </div>
          <div className="flex w-full flex-col gap-2 lg:flex-row">
            <TaskListCard
              tasks={getOverdueTasks()}
              title={"Overdue Tasks"}
            ></TaskListCard>
            <TaskListCard
              tasks={getUpcomingDeadlinesTasks()}
              title={"Upcoming Deadlines"}
            ></TaskListCard>
          </div>
        </div>
      </div>
    </div>
  );
}
