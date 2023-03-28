import { Outlet } from "react-router-dom";

export default function Root() {
  return (
    <>
      <div className="h-screen bg-zinc-900 text-slate-100 2xl:flex 2xl:flex-col 2xl:items-center">
        <div className="flex h-screen w-full flex-col 2xl:w-2/3 2xl:justify-start">
          <div className="mb-10 flex w-full basis-24 px-8 2xl:px-0">
            <div className="flex items-center">
              <div className="w-16  2xl:w-12">
                <img src="/Logo.svg" alt="" />
              </div>
              <h1 className="font-serif text-xl tracking-wider">Manageable</h1>
            </div>
            <div className="ml-12 mr-8 h-1/2 flex-1 border-b border-zinc-500 2xl:mr-0 2xl:ml-4"></div>
          </div>
          <div className="flex grid grid-cols-6">
            <div className="col-span-6 flex flex-col justify-center px-12 lg:col-span-2 lg:p-12 lg:pr-0 2xl:px-0">
              <h1 className="mb-4 text-3xl font-bold tracking-wider lg:text-2xl xl:text-5xl xl:leading-[3.5rem] 2xl:text-3xl">
                Be the architect of your own workspace
              </h1>
              <div className="mb-4 border-b border-indigo-500"></div>
              <p className="tracking-wider opacity-70 lg:text-sm xl:text-lg 2xl:text-sm">
                Create kanban boards for your projects and collaborate on them
                with a team for free!
              </p>
            </div>
            <div className="col-span-6 mt-12 flex items-center pl-24 lg:col-span-4 lg:justify-end">
              <div className="w-full overflow-hidden rounded-lg drop-shadow-4xl">
                <img
                  src="/demo.png"
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        {/* <Outlet /> */}
      </div>
    </>
  );
}
