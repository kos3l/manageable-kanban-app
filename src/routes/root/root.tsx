export default function Root() {
  return (
    <>
      <div className="min-h-screen bg-hero-pattern text-slate-100 2xl:flex 2xl:flex-col 2xl:items-center">
        <div className="flex min-h-screen w-full flex-col 2xl:w-2/3 2xl:justify-start">
          <div className="mb-4 flex w-full basis-24 px-4 md:mb-10 md:px-8 2xl:px-0">
            <div className="flex items-center">
              <div className="w-12 md:w-16 2xl:w-12">
                <img src="./src/assets/Logo.svg" alt="" />
              </div>
              <h1 className="font-serif text-sm tracking-wider md:text-xl">
                Manageable
              </h1>
            </div>
            <div className="ml-12 mr-8 hidden h-1/2 flex-1 border-b border-zinc-500 md:block 2xl:mr-0 2xl:ml-4"></div>
          </div>
          <div className="mt-20 flex grid grid-cols-6 gap-16">
            <div className="col-span-6 flex items-start justify-center">
              <div className="flex w-3/4 flex-col items-center text-center">
                <h1 className="mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent drop-shadow xl:leading-[4rem]">
                  Be the architect of <br /> your own workspace
                </h1>
                <p className="w-4/6 text-2xl opacity-80">
                  Create kanban boards for your projects <br /> and collaborate
                  on them with a team for free!
                </p>
              </div>
            </div>
            <div className="col-span-6 flex items-center justify-center">
              <div className=" w-5/6 overflow-hidden rounded-lg drop-shadow-4xl">
                <img
                  src="./src/assets/demo.png"
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
