import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div className="bg-zinc-900 h-screen text-slate-100">
        <p>im root</p>
        <Outlet />
      </div>
    </>
  );
}
