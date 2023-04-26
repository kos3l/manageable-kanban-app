import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import LandingButton from "../../ui/buttons/LandingButton";
export default function Home() {
  return (
    <>
      <div className="mt-20 flex grid grid-cols-6 gap-16">
        <div className="col-span-6 flex items-start justify-center">
          <div className="flex w-3/4 flex-col items-center text-center">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-5xl font-bold text-transparent drop-shadow xl:leading-[4rem]">
              Be the architect of <br /> your own workspace
            </h1>
            <p className="mb-8 w-4/6 text-2xl opacity-90">
              Create kanban boards for your projects <br /> and collaborate on
              them with a team for free!
            </p>
            <div className="flex w-2/3 justify-center gap-4">
              <div className="h-max w-1/3">
                <Link to={"./login"}>
                  <LandingButton
                    content={"SIGN IN"}
                    color="indigo"
                    icon={
                      <ArrowLeftOnRectangleIcon className="w-6 text-indigo-500"></ArrowLeftOnRectangleIcon>
                    }
                  ></LandingButton>
                </Link>
              </div>
              <div className="h-max w-1/3">
                <Link to={"./register"}>
                  <LandingButton
                    content={"GET STARTED"}
                    color="white"
                    icon={
                      <UserPlusIcon className="w-6 text-neutral-200"></UserPlusIcon>
                    }
                  ></LandingButton>
                </Link>
              </div>
            </div>
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
