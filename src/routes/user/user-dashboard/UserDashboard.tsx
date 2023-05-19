import { ClipboardDocumentListIcon } from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import useProjectService from "../../../hooks/service/useProjectService";
import useTaskService from "../../../hooks/service/useTaskService";
import { Column } from "../../../models/entities/Column";
import { Project } from "../../../models/entities/Project";
import { Task } from "../../../models/entities/Task";
import ProjectCard from "../../../ui/cards/ProjectCard";
import TaskListCard from "../../../ui/cards/TaskListCard";
import WrapperCard from "../../../ui/cards/WrapperCard";
import TasksPerColumnChart from "../../../ui/charts/TasksPerColumnChart";

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

const tasksForUserQuery = (
  getTasksByUser: () => Promise<AxiosResponse<Task[], any>>
) => ({
  queryKey: ["statistic"],
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

    return response.data;
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
    return <p>loading</p>;
  }

  // Get all columns which have tasks assigned to the logged in user
  const allColumns = projects
    .map((project) => project.columns)
    .reduce((acc, val) => {
      return acc.concat(val);
    })
    .filter((col) => tasks?.find((task) => task.columnId == col._id));

  // Merge columns named the same into one column and filter their tasks to leave only ones assigned to the current user
  const mergedColumns = Array.from(
    new Set(allColumns.map((col) => col.name))
  ).map((name) => {
    return {
      _id: allColumns.find((col) => col.name === name)?._id,
      name: name,
      tasks: allColumns
        .filter((col) => col.name === name)
        .map((edition) => edition.tasks)
        .reduce((acc, val) => {
          return acc.concat(val);
        })
        .filter((task) => tasks?.find((t) => t._id == task)),
    };
  }) as Column[];

  return (
    <div className="flex h-max w-full flex-col gap-3 bg-gradient-to-b from-neutral-900 p-4 2xl:w-3/4">
      <h1 className="bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-2xl font-bold text-transparent ">
        Welcome to your dashboard!
      </h1>
      <div className="flex h-max w-full gap-3">
        <div className="flex h-max w-2/5">
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
        <div className="flex h-max w-3/5 flex-col gap-3">
          <div className="flex h-max w-full gap-3 rounded-lg border border-neutral-600 bg-neutral-800/20 p-1">
            <TasksPerColumnChart columns={mergedColumns}></TasksPerColumnChart>
          </div>
          <div className="flex w-full gap-2">
            {/* Limit to be only first 10 */}
            <TaskListCard
              tasks={
                tasks
                  ? tasks
                      .filter((task) => new Date() > new Date(task.endDate))
                      .sort((a, b) =>
                        new Date(b.endDate) < new Date(a.endDate) ? -1 : 1
                      )
                  : []
              }
              title={"Overdue Tasks"}
            ></TaskListCard>
            <TaskListCard
              tasks={
                tasks
                  ? tasks
                      .filter((task) => new Date() < new Date(task.endDate))
                      .sort((a, b) =>
                        new Date(b.endDate) < new Date(a.endDate) ? 1 : -1
                      )
                  : []
              }
              title={"Upcoming Deadlines"}
            ></TaskListCard>
          </div>
        </div>
      </div>
    </div>
  );
}
