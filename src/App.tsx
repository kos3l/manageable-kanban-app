import "./App.css";
import {
  Route,
  createRoutesFromElements,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import ErrorPage from "./routes/root/error-page";
import Root from "./routes/root/root";
import ErrorUserPage from "./routes/user/user-root/error-page";
import PrivateRoutes from "./auth/components/ProtectedRoute";
import { loader as profileLoader } from "./routes/user/user-root/UserRoot";
import PageNotFound from "./routes/404/PageNotFound";
import useUserService from "./hooks/service/useUserService";
import { action as userUpdateAction } from "./routes/profile/EditUser";
import TeamPage from "./routes/team/Team";
import HomePage from "./routes/home/home";
import LoginPage from "./routes/login/login";
import ProfilePage from "./routes/profile/Profile";
import ProjectPage from "./routes/project/Project";
import ProjectsOverviewPage from "./routes/projects-overview/ProjectsOverview";
import RegisterPage from "./routes/register/Register";
import TeamsOverviewPage from "./routes/teams-overview/TeamsOverview";
import EditUserPage from "./routes/profile/EditUser";
import UserDashboardPage from "./routes/user/user-dashboard/UserDashboard";
import UserRootPage from "./routes/user/user-root/UserRoot";
import useTeamService from "./hooks/service/useTeamService";
import CreateTeam, {
  action as createTeamAction,
} from "./routes/team/CreateTeam";
import UpdateTeamMembersPage, {
  action as updateTeamMembersAction,
} from "./routes/team/UpdateTeamMembers";
import TeamRoot, {
  loader as teamLoader,
  action as deleteTeamAction,
} from "./routes/team/TeamRoot";
import EditTeam, { action as updateTeamAction } from "./routes/team/EditTeam";
import CreateProject, {
  action as createProjectAction,
} from "./routes/project/CreateProject";
import useProjectService from "./hooks/service/useProjectService";
import ProjectRoot, {
  loader as projectByIdLoader,
} from "./routes/project/ProjectRoot";
import EditProjectPage, {
  action as updateProjectAction,
} from "./routes/project/EditProject";
import KanbanPage, { action as kanbanActions } from "./routes/project/Kanban";
import KanbanOverview from "./routes/kanban-overview/KanbanOverview";

const App = ({ queryClient }: any) => {
  const { getLoggedInUserProfile, updateUserProfile } = useUserService();
  const {
    getTeamById,
    createNewTeam,
    updateTeamMembers,
    updateTeam,
    deleteTeam,
  } = useTeamService();
  const {
    createNewProject,
    getProjectById,
    updateProject,
    addColumnToProject,
    updateColumn,
    deleteColumn,
  } = useProjectService();
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="">
        <Route errorElement={<ErrorPage />} path="/" element={<Root />}>
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        <Route errorElement={<ErrorUserPage />} element={<PrivateRoutes />}>
          <Route
            path="/user/"
            element={<UserRootPage />}
            loader={profileLoader(queryClient, getLoggedInUserProfile)}
            id="userRoot"
          >
            <Route path="profile/:id" element={<ProfilePage />} />
            <Route
              path="profile/:id/edit"
              element={<EditUserPage />}
              action={userUpdateAction(queryClient, updateUserProfile)}
            />
            <Route
              index
              path="user-dashboard"
              element={<UserDashboardPage />}
            />
            <Route path="teams-overview" element={<TeamsOverviewPage />} />
            <Route
              path="teams/:id/"
              element={<TeamRoot />}
              loader={teamLoader(queryClient, getTeamById)}
              action={deleteTeamAction(queryClient, deleteTeam)}
              id="selectedTeam"
            >
              <Route index path="" element={<TeamPage />}></Route>
              <Route
                path="edit"
                element={<EditTeam />}
                action={updateTeamAction(queryClient, updateTeam)}
              ></Route>
              <Route
                path="update-members"
                action={updateTeamMembersAction(queryClient, updateTeamMembers)}
                element={<UpdateTeamMembersPage />}
              />
            </Route>
            <Route
              path="teams/create"
              action={createTeamAction(queryClient, createNewTeam)}
              element={<CreateTeam />}
            />
            <Route
              path="projects/:id"
              element={<ProjectRoot />}
              loader={projectByIdLoader(queryClient, getProjectById)}
              id="selectedProject"
              action={kanbanActions(
                queryClient,
                addColumnToProject,
                updateColumn,
                deleteColumn
              )}
            >
              <Route index path="" element={<ProjectPage />} />
              <Route
                path="edit"
                action={updateProjectAction(queryClient, updateProject)}
                element={<EditProjectPage />}
              />
              <Route path="kanban" element={<KanbanPage />} />
            </Route>
            <Route
              path="projects-overview"
              element={<ProjectsOverviewPage />}
            />
            <Route
              path="projects/create"
              action={createProjectAction(queryClient, createNewProject)}
              element={<CreateProject />}
            />
            <Route path="kanban-overview" element={<KanbanOverview />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
export default App;
