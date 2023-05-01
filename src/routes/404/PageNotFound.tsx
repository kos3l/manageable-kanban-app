import { HomeIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import LandingButton from "../../ui/buttons/LandingButton";
import mock from "../../assets/demo.png";

export default function PageNotFound() {
  return (
    <div className="flex h-screen w-screen items-center justify-center gap-5 bg-hero-pattern">
      <h1 className="mt-2 bg-gradient-to-r from-indigo-500 to-pink-500 bg-clip-text text-6xl font-bold text-transparent drop-shadow xl:leading-[4rem]">
        404
      </h1>
      <div className="h-max w-56 text-neutral-200">
        <Link to={"/"}>
          <LandingButton
            content={"Home Page"}
            color="indigo"
            icon={<HomeIcon className="w-6 text-indigo-500"></HomeIcon>}
          ></LandingButton>
        </Link>
      </div>
    </div>
  );
}
