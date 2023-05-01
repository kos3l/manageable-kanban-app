import { useQuery } from "react-query";
import { Link, Outlet } from "react-router-dom";
import avatar from "../../../assets/avatar.png";
import useUserService from "../../../hooks/service/useUserService";
import useAuth from "../../../hooks/useAuth";
import logo from "../../../assets/Logo.svg";
import {
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  HomeIcon,
} from "@heroicons/react/24/solid";
import NavigationButton from "../../../ui/buttons/NavigationButton";
import NavigationItems from "../../../static/NavigationItems";
import useAuthService from "../../../hooks/service/useAuthService";
import { useState } from "react";
export default function UserRoot() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const { getLoggedInUserProfile } = useUserService();
  const { auth, setAuth } = useAuth();
  const { logoutUser } = useAuthService();

  const canFetchUser =
    auth &&
    auth.accessToken !== undefined &&
    auth.accessToken !== null &&
    auth.accessToken !== "";

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["logged-in-user"],
    queryFn: async () => {
      const response = await getLoggedInUserProfile();
      if (response.status == 401 || response.status == 403) {
        throw new Error("Token expired");
      }
      return response.data;
    },
    enabled: canFetchUser,
    onError: (error: any) => {
      // navigate("/login", { replace: true });
    },
  });

  const logout = useQuery({
    queryKey: ["logout"],
    retry: 1,
    queryFn: async () => {
      await logoutUser();
    },
    onSuccess: (data: any) => {
      setAuth((prev) => {
        return { accessToken: "" };
      });
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <div className="relative flex h-screen overflow-hidden text-neutral-200 md:overflow-scroll">
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
            <div className="absolute top-0 left-[1px] z-10 flex h-full w-full flex-col overflow-scroll">
              {NavigationItems.navItemsList.map((item) => {
                return (
                  <>
                    {item.sectionTitle && (
                      <div className="mt-4 mb-2 flex h-4 w-full px-4 text-xs font-medium tracking-wider text-neutral-500">
                        {item.sectionTitle}
                      </div>
                    )}
                    <NavigationButton
                      content={item.name}
                      icon={item.icon}
                      toPath={item.path}
                    ></NavigationButton>
                  </>
                );
              })}
            </div>
          </div>
          <button
            onClick={() => logout.refetch()}
            className="absolute bottom-0 z-30 flex h-16 w-full items-center gap-2 border-t  border-neutral-700 bg-neutral-900 px-4 hover:bg-neutral-800/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <ArrowRightOnRectangleIcon className="w-6 text-neutral-200"></ArrowRightOnRectangleIcon>
            </div>
            <p className="mt-1 text-sm tracking-wide">Log out</p>
          </button>
        </div>
        <div className="flex h-full grow flex-col-reverse  md:flex-col">
          <div className="relative z-40 flex h-14 w-full grow-0 items-center justify-between border-t border-neutral-700 bg-neutral-900 px-4 md:justify-end md:border-t-0 md:border-b">
            <div className="flex h-full w-1/2 flex-row-reverse items-center justify-end gap-4 md:w-max md:flex-row">
              <p className="mt-1 font-serif text-sm">
                {data?.firstName + " " + data?.lastName}
              </p>
              <div className="w-8 overflow-hidden rounded-lg">
                <img
                  src={avatar}
                  alt=""
                  className="h-full w-full object-contain"
                />
              </div>
            </div>
            <div
              className="relative z-40 flex h-8 w-8 items-center justify-center rounded-lg bg-neutral-600/30 md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Bars3Icon className="w-6 text-neutral-200"></Bars3Icon>
            </div>
          </div>
          <div className="w-full grow p-4">
            <Outlet />
          </div>
        </div>
        <div
          className={
            isMobileMenuOpen
              ? "absolute bottom-[4rem] z-30 h-max w-full w-screen border-t  border-neutral-600 pt-2 opacity-100 transition-opacity md:hidden "
              : "absolute bottom-full opacity-0 transition-opacity"
          }
        >
          <div className="flex w-full flex-col">
            {NavigationItems.navItemsList.map((item) => {
              return (
                <>
                  {item.sectionTitle && (
                    <div className="mt-4 mb-2 flex h-4 w-full px-4 text-xs font-medium tracking-wider text-neutral-500">
                      {item.sectionTitle}
                    </div>
                  )}
                  <NavigationButton
                    content={item.name}
                    icon={item.icon}
                    toPath={item.path}
                  ></NavigationButton>
                </>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
