import {
  ArrowLeftOnRectangleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import LandingButton from "../../ui/buttons/LandingButton";
import mock from "../../assets/demo.png";
export default function HomePage() {
  return (
    <>
      <div className="mt-10 flex grid grid-cols-6 gap-16 sm:mt-20">
        <div className="col-span-6 flex items-start justify-center">
          <div className="flex w-full flex-col items-center text-center lg:w-3/4">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-3xl font-bold leading-9 text-transparent drop-shadow sm:text-5xl sm:leading-[4rem]">
              Be the architect of <br /> your own workspace
            </h1>
            <p className="mb-8 w-full text-base opacity-90 sm:w-4/6 sm:text-2xl">
              Create kanban boards for your projects and <br /> collaborate on
              them with a team for free!
            </p>
            <div className="flex w-2/3 flex-col justify-center gap-4 sm:w-2/3 sm:flex-row">
              <div className="h-max  w-full sm:w-1/3">
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
              <div className="h-max w-full sm:w-1/3">
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
        <div className="col-span-6 mb-0 flex h-max items-center justify-center sm:mb-16">
          <div className="h-96 w-full overflow-hidden rounded-lg drop-shadow-4xl sm:h-[auto] sm:w-5/6">
            <img
              src={mock}
              alt=""
              className="h-full w-full object-cover sm:object-contain"
            />
          </div>
        </div>
      </div>
    </>
  );
}
