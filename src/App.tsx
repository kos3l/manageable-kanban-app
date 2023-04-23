import { useState } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./routes/home/home";
import ErrorPage from "./routes/root/error-page";
import Login from "./routes/login/login";
import Root from "./routes/root/root";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route errorElement={<ErrorPage />} path="/" element={<Root />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
