import { Link, Outlet } from "react-router-dom";
export default function Root() {
  return (
    <>
      <div className="min-h-screen bg-hero-pattern text-neutral-200 2xl:flex 2xl:flex-col 2xl:items-center">
        <div className="flex min-h-screen w-full flex-col 2xl:w-2/3 2xl:justify-start">
          <div className="mb-4 flex w-full basis-24 px-4 md:mb-10 md:px-8 2xl:px-0">
            <div className="flex items-center">
              <Link to={"/"}>
                <div className="w-12 md:w-16 2xl:w-12">
                  <img src="./src/assets/Logo.svg" alt="" />
                </div>
              </Link>
              <Link to={"/"}>
                <h1 className="font-serif text-sm tracking-wider md:text-xl">
                  Manageable
                </h1>
              </Link>
            </div>
            <div className="ml-12 mr-8 hidden h-1/2 flex-1 border-b border-zinc-500 font-sans md:block 2xl:mr-0 2xl:ml-4"></div>
          </div>
          <Outlet />
        </div>
      </div>
    </>
  );
}
