import { Link, Outlet } from "react-router-dom";
export default function UserRoot() {
  return (
    <>
      <div className="min-h-screen text-neutral-200 2xl:flex 2xl:flex-col 2xl:items-center">
        root
        <Outlet />
      </div>
    </>
  );
}
