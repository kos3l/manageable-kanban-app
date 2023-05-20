import { HomeIcon, UserIcon } from "@heroicons/react/24/solid";
import { Link, useRouteError } from "react-router-dom";
import LandingButton from "../../../ui/buttons/LandingButton";

export default function ErrorPage() {
  const error: any = useRouteError();

  return (
    <div
      id="error-page"
      className="bg-red-pattern flex h-screen w-screen items-center justify-center "
    >
      <div className="flex w-max flex-col items-start">
        <h1 className="mt-2 mb-3 text-4xl font-bold text-neutral-300 drop-shadow xl:leading-[4rem]">
          <span className="opacity-70"> {"The issue is: "}</span>

          <i>{error.statusText || error.message}</i>
        </h1>
        <div className="h-max w-80 text-neutral-200">
          <Link to={"/login"}>
            <LandingButton
              content={"Login"}
              color="indigo"
              icon={<UserIcon className="w-6 text-indigo-500"></UserIcon>}
            ></LandingButton>
          </Link>
        </div>
      </div>
    </div>
  );
}
