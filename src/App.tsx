import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/home";
import ErrorPage from "./routes/root/error-page";
import Login from "./routes/login/login";
import Root from "./routes/root/root";
import Register from "./routes/register/Register";
import ErrorUserPage from "./routes/user/user-root/error-page";
import UserRoot from "./routes/user/user-root/UserRoot";
import UserDashboard from "./routes/user/user-dashboard/UserDashboard";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route errorElement={<ErrorPage />} path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
        </Route>
        <Route
          errorElement={<ErrorUserPage />}
          path="/user/"
          element={<UserRoot />}
        >
          <Route path="user-dashboard" element={<UserDashboard />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
