import { useQuery } from "react-query";
import { Link, Outlet } from "react-router-dom";
import avatar from "../../../assets/avatar.png";
import useUserService from "../../../hooks/service/useUserService";
import useAuth from "../../../hooks/useAuth";
import logo from "../../../assets/Logo.svg";
import { ArrowRightOnRectangleIcon, HomeIcon } from "@heroicons/react/24/solid";
import NavigationButton from "../../../ui/buttons/NavigationButton";
import NavigationItems from "../../../static/NavigationItems";
import useAuthService from "../../../hooks/service/useAuthService";
export default function UserRoot() {
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
      <div className="flex h-screen overflow-scroll text-neutral-200">
        <div className="relative hidden h-full grow-0 flex-col  border-r border-neutral-700 md:flex md:min-w-[10rem] lg:min-w-[15rem] 2xl:min-w-[20rem]">
          <div className="flex h-14 items-center p-2">
            <Link to={"/"}>
              <div className="w-11">
                <img src={logo} alt="" />
              </div>
            </Link>
            <Link to={"/"}>
              <p className="font-serif text-base tracking-wider">Manageable</p>
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
            className="absolute bottom-0 z-30 flex h-16 w-full items-center gap-2 border-t border-neutral-700 bg-neutral-900 px-4 hover:bg-neutral-800/50"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg">
              <ArrowRightOnRectangleIcon className="w-6 text-neutral-200"></ArrowRightOnRectangleIcon>
            </div>
            <p className="mt-1 text-sm tracking-wide">Log out</p>
          </button>
        </div>
        <div className="flex h-full grow flex-col">
          <div className="flex h-14 w-full grow-0 items-center justify-end gap-4 border-b border-neutral-700 px-4">
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
          <div className="w-full grow p-4">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
