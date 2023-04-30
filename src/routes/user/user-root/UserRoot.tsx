import { useQuery } from "react-query";
import { Link, Outlet } from "react-router-dom";
import avatar from "../../../assets/avatar.png";
import useUserService from "../../../hooks/service/useUserService";
import useAuth from "../../../hooks/useAuth";
export default function UserRoot() {
  const { getLoggedInUserProfile } = useUserService();
  const { auth } = useAuth();

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

  return (
    <>
      <div className="flex min-h-screen text-neutral-200">
        <div className="hidden grow-0 border-r border-neutral-700 md:flex md:min-w-[10rem] lg:min-w-[15rem] 2xl:min-w-[20rem]"></div>
        <div className="flex grow flex-col">
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
          <div className="w-full grow">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
}
