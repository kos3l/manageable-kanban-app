import "./App.css";
import {
  Routes,
  Route,
  createRoutesFromElements,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import Home from "./routes/home/home";
import ErrorPage from "./routes/root/error-page";
import Login from "./routes/login/login";
import Root from "./routes/root/root";
import Register from "./routes/register/Register";
import ErrorUserPage from "./routes/user/user-root/error-page";
import UserDashboard from "./routes/user/user-dashboard/UserDashboard";
import PrivateRoutes from "./auth/components/ProtectedRoute";
import UserRoot, {
  loader as profileLoader,
} from "./routes/user/user-root/UserRoot";
import TeamsOverview from "./routes/teams-overview/TeamsOverview";
import PageNotFound from "./routes/404/PageNotFound";
import Team from "./routes/team/Team";
import ProjectsOverview from "./routes/projects-overview/ProjectsOverview";
import Project from "./routes/project/Project";
import Profile from "./routes/profile/Profile";
import useUserService from "./hooks/service/useUserService";
import useAuth from "./hooks/useAuth";
import useHttp from "./hooks/useHttp";
import useRefreshToken from "./hooks/useRefreshToken";
import { useEffect } from "react";

const App = ({ queryClient }: any) => {
  const { getLoggedInUserProfile } = useUserService();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="">
        <Route errorElement={<ErrorPage />} path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route errorElement={<ErrorUserPage />} element={<PrivateRoutes />}>
          <Route
            path="/user/"
            element={<UserRoot />}
            loader={profileLoader(queryClient, getLoggedInUserProfile)}
          >
            <Route path="profile" element={<Profile />} />
            <Route path="user-dashboard" element={<UserDashboard />} />
            <Route path="teams-overview" element={<TeamsOverview />} />
            <Route path="teams/:id" element={<Team />} />
            <Route path="projects-overview" element={<ProjectsOverview />} />
            <Route path="projects/:id" element={<Project />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};
export default App;
