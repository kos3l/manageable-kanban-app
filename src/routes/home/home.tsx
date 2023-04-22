import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <>
      <div className="mt-20 flex grid grid-cols-6 gap-16">
        <div className="col-span-6 flex items-start justify-center">
          <div className="flex w-3/4 flex-col items-center text-center">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent drop-shadow xl:leading-[4rem]">
              Be the architect of <br /> your own workspace
            </h1>
            <p className="mb-8 w-4/6 text-2xl opacity-80">
              Create kanban boards for your projects <br /> and collaborate on
              them with a team for free!
            </p>
            <Link to={"./login"}>
              <button className="flex w-80 items-center gap-4 rounded-xl border-2 border-neutral-600 bg-neutral-900 px-4 py-3 transition hover:border-indigo-500 hover:drop-shadow-4xl hover:transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20">
                  <ArrowRightOnRectangleIcon className="w-6 text-indigo-500"></ArrowRightOnRectangleIcon>
                </div>
                <p className="m-0 font-serif text-sm font-semibold tracking-wide">
                  SIGN IN
                </p>
              </button>
            </Link>
          </div>
        </div>
        <div className="col-span-6 mb-16 flex items-center justify-center">
          <div className=" w-5/6 overflow-hidden rounded-lg drop-shadow-4xl">
            <img
              src="./src/assets/demo.png"
              alt=""
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
}
