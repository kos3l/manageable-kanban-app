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
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
