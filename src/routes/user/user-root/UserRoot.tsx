import { Link, Outlet } from "react-router-dom";
export default function UserRoot() {
  return (
    <>
      <div className="grid min-h-screen grid-cols-6 text-neutral-200">
        <div className="col-span-1 border-r border-neutral-700"></div>
        <div className="col-span-5">
          <div className="col-span-6 h-12 border-b border-neutral-700"></div>
          <div className="col-span-6 ">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
