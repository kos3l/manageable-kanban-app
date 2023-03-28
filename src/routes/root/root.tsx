import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div className="flex h-screen flex-col bg-zinc-900 text-slate-100">
        <div className="flex w-full basis-24 px-8 ">
          <div className="flex items-center">
            <div className="w-16">
              <img src="/Logo.svg" alt="" />
            </div>
            <h1 className="font-serif text-xl tracking-wider">Manageable</h1>
          </div>
          <div className="ml-12 mr-8 h-1/2 flex-1 border-b border-zinc-500"></div>
        </div>
        <div className="flex flex-1 ">
          <div className="flex w-1/3 flex-col justify-center p-12 pr-0">
            <h1 className="mb-4 text-5xl font-bold leading-[3.5rem] tracking-wider">
              Be the architect of your own workspace
            </h1>
            <div className="mb-4 border-b border-indigo-500"></div>
            <p className="text-lg tracking-wider opacity-70">
              Create kanban boards for your projects and collaborate on them
              with a team for free!
            </p>
          </div>
          <div className="flex w-2/3 items-center justify-end pl-24">
            <div className="w-full overflow-hidden rounded-lg drop-shadow-4xl">
              <img
                src="/demo.png"
                alt=""
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>

        {/* <Outlet /> */}
      </div>
    </>
  );
}
