import { Link } from "react-router-dom";
import logo from "../../assets/Logo.svg";

export default function LoadingRoute() {
  return (
    <>
      <div className="max-w-screen  relative flex h-screen overflow-hidden text-neutral-200">
        <div className="relative hidden h-full grow-0 flex-col border-r border-neutral-700 md:flex md:min-w-[10rem] lg:min-w-[15rem] 2xl:min-w-[20rem]">
          <div className="flex h-14 items-center p-2">
            <Link to={"/"}>
              <div className="w-11">
                <img src={logo} alt="" />
              </div>
            </Link>
            <Link to={"/"}>
              <p className="font-serif text-sm tracking-wider lg:text-base">
                Manageable
              </p>
            </Link>
          </div>
          <div className="relative flex h-full w-full ">
            <div className="absolute top-0 left-[1px] z-10 flex h-full w-full flex-col overflow-scroll"></div>
          </div>
        </div>
        <div className="flex h-full grow flex-col-reverse md:flex-col">
          <div className="relative flex w-full grow overflow-scroll bg-hero-pattern 2xl:justify-center">
            <div className="flex h-screen w-screen items-center justify-center gap-5 bg-hero-pattern"></div>
          </div>
        </div>
        <div className={"absolute bottom-full opacity-0 transition-opacity"}>
          <div className="flex w-full flex-col"></div>
        </div>
      </div>
    </>
  );
}
