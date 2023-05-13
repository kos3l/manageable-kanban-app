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
import { action as userUpdateAction } from "./routes/user/edit-user/EditUser";
import TeamPage, { loader as teamLoader } from "./routes/team/Team";
import HomePage from "./routes/home/home";
import LoginPage from "./routes/login/login";
import ProfilePage from "./routes/profile/Profile";
import ProjectPage from "./routes/project/Project";
import ProjectsOverviewPage from "./routes/projects-overview/ProjectsOverview";
import RegisterPage from "./routes/register/Register";
import TeamsOverviewPage from "./routes/teams-overview/TeamsOverview";
import EditUserPage from "./routes/user/edit-user/EditUser";
import UserDashboardPage from "./routes/user/user-dashboard/UserDashboard";
import UserRootPage from "./routes/user/user-root/UserRoot";
import useTeamService from "./hooks/service/useTeamService";

const App = ({ queryClient }: any) => {
  const { getLoggedInUserProfile, updateUserProfile } = useUserService();
  const { getTeamById } = useTeamService();

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
            <Route path="user-dashboard" element={<UserDashboardPage />} />
            <Route path="teams-overview" element={<TeamsOverviewPage />} />
            <Route
              path="teams/:id"
              element={<TeamPage />}
              loader={teamLoader(queryClient, getTeamById)}
            />
            <Route
              path="projects-overview"
              element={<ProjectsOverviewPage />}
            />
            <Route path="projects/:id" element={<ProjectPage />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
export default App;
