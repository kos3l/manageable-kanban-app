import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/home";
import ErrorPage from "./routes/root/error-page";
import Login from "./routes/login/login";
import Root from "./routes/root/root";
import Register from "./routes/register/Register";
import ErrorUserPage from "./routes/user/user-root/error-page";
import UserDashboard from "./routes/user/user-dashboard/UserDashboard";
import PrivateRoutes from "./auth/components/ProtectedRoute";
import UserRoot from "./routes/user/user-root/UserRoot";
import TeamsOverview from "./routes/teams-overview/TeamsOverview";
import PageNotFound from "./routes/404/PageNotFound";
import Team from "./routes/team/Team";
import ProjectsOverview from "./routes/projects-overview/ProjectsOverview";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route errorElement={<ErrorPage />} path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route errorElement={<ErrorUserPage />} element={<PrivateRoutes />}>
          <Route path="/user/" element={<UserRoot />}>
            <Route path="user-dashboard" element={<UserDashboard />} />
            <Route path="teams-overview" element={<TeamsOverview />} />
            <Route path="teams/:id" element={<Team />} />
            <Route path="projects-overview" element={<ProjectsOverview />} />
          </Route>
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
