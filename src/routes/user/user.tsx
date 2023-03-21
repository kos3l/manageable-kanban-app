import { Outlet } from "react-router-dom";

export default function User() {
  return (
    <>
      <div>
        <h1>User</h1>
        <Outlet />
      </div>
    </>
  );
}
