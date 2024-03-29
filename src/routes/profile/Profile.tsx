import { Link, useNavigate } from "react-router-dom";
import { User } from "../../models/entities/User";
import avatar from "../../assets/avatar.png";
import ActionButton from "../../ui/buttons/ActionButton";
import {
  ArrowRightOnRectangleIcon,
  CakeIcon,
  ClipboardDocumentListIcon,
  PencilSquareIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import DisplayField from "../../ui/display-field/DisplayField";
import { useQuery } from "react-query";
import { AxiosResponse } from "axios";
import { Project } from "../../models/entities/Project";
import useProjectService from "../../hooks/service/useProjectService";
import ProjectCard from "../../ui/cards/ProjectCard";
import TeamCard from "../../ui/cards/TeamCard";
import useUserService from "../../hooks/service/useUserService";
import WrapperCard from "../../ui/cards/WrapperCard";
import useTeamService from "../../hooks/service/useTeamService";
import { Team } from "../../models/entities/Team";
import useAuthService from "../../hooks/service/useAuthService";
import useAuth from "../../hooks/useAuth";
import QueryKeys from "../../static/QueryKeys";

const projectsWithTeamsQuery = (
  getAllUserProjects: () => Promise<AxiosResponse<Project[], any>>
) => ({
  queryKey: QueryKeys.projectsWithTeams,
  queryFn: async () => {
    const response = await getAllUserProjects();
    if (response.status == 403) {
      throw new Error("Token expired");
    }
    if (!response) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }

    return response.data;
  },
});

const profileQuery = (
  getUserProfileQuery: () => Promise<AxiosResponse<User, any>>
) => ({
  queryKey: QueryKeys.userProfile,
  queryFn: async () => {
    const response = await getUserProfileQuery();
    if (response.status == 403) {
      throw new Error("Token expired");
    }
    if (!response) {
      throw new Response("", {
        status: 404,
        statusText: "Not Found",
      });
    }
    return response.data;
  },
});

const getAllTeams = (
  getAllUserTeams: () => Promise<AxiosResponse<Team[], any>>
) => ({
  queryKey: QueryKeys.allTeams,
  queryFn: async () => {
    const response = await getAllUserTeams();
    if (response.status == 401 || response.status == 403) {
      throw new Error("Token expired");
    }

    return response.data;
  },
});

export default function ProfilePage() {
  const { getAllUserProjects } = useProjectService();
  const { getLoggedInUserProfile } = useUserService();
  const { getAllUserTeams } = useTeamService();
  const { logoutUser } = useAuthService();
  const { setAuth } = useAuth();
  const navigate = useNavigate();

  const { data: user } = useQuery(profileQuery(getLoggedInUserProfile));
  const { data: projects } = useQuery(
    projectsWithTeamsQuery(getAllUserProjects)
  );
  const { data: teams } = useQuery(getAllTeams(getAllUserTeams));

  if (!user) {
    return (
      <div className="relative flex h-max w-full flex-wrap gap-4 bg-gradient-to-b from-neutral-900 p-4 sm:h-full sm:flex-nowrap sm:overflow-scroll 2xl:w-2/3">
        {<>Loading</>}
      </div>
    );
  }

  const logout = useQuery({
    queryKey: QueryKeys.logout,
    retry: 1,
    queryFn: async () => {
      await logoutUser();
    },
    onSuccess: (data: any) => {
      navigate("/login");
      setAuth((prev) => {
        return { accessToken: null };
      });
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  return (
    <div className="relative flex h-max w-full flex-wrap gap-4 bg-gradient-to-b from-neutral-900 p-4 sm:h-full sm:flex-nowrap sm:overflow-scroll 2xl:w-2/3">
      <div className="flex h-80 w-full grow-0 flex-col gap-3  sm:h-full sm:basis-96 md:basis-64 lg:basis-72">
        <div className="w-full overflow-hidden rounded-lg border border-neutral-600  sm:border-0 ">
          <img src={avatar} alt="" className="h-full w-full object-contain" />
        </div>
        <Link to={"./edit"}>
          <ActionButton
            color="indigo"
            content={"Edit Profile"}
            icon={
              <PencilSquareIcon className="w-5 text-indigo-500"></PencilSquareIcon>
            }
          ></ActionButton>
        </Link>
        <ActionButton
          onClick={() => logout.refetch()}
          color="indigo"
          content={"Log out"}
          icon={
            <ArrowRightOnRectangleIcon className="w-5 text-indigo-500"></ArrowRightOnRectangleIcon>
          }
        ></ActionButton>
      </div>
      <div className="flex grid h-max w-full grow-0 grid-cols-4 gap-3 sm:grow 2xl:h-max">
        <div className="col-span-4 flex h-max flex-col gap-2 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3 2xl:h-max">
          <h1 className="text-xl">{user.firstName + " " + user.lastName}</h1>
          <div className="flex h-max w-full flex-wrap items-start gap-2 sm:flex-nowrap">
            <div className="flex w-full sm:min-w-[7rem] sm:basis-32">
              <DisplayField
                color="white"
                label={"Birthday"}
                icon={<CakeIcon className="w-5 text-neutral-300"></CakeIcon>}
                placeholder="Missing data"
                value={new Date(user.birthdate).toLocaleDateString(undefined, {
                  month: "long",
                  day: "numeric",
                })}
              ></DisplayField>
            </div>
            <div className="mt-0.5 flex w-full sm:w-max sm:grow">
              <DisplayField
                color="white"
                label={"Bio"}
                placeholder="No description yet"
                value={user.bio}
              ></DisplayField>
            </div>
          </div>
        </div>
        <div className="col-span-4 flex max-h-full grow  overflow-scroll lg:col-span-2">
          <WrapperCard
            minHeight={false}
            name={"Teams"}
            displayEntities={teams ? teams : []}
            displayComponent={(team) => (
              <TeamCard
                team={team}
                key={team._id}
                icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
              ></TeamCard>
            )}
          ></WrapperCard>
        </div>
        <div className="col-span-4 flex max-h-full grow gap-3  overflow-scroll lg:col-span-2">
          <WrapperCard
            minHeight={false}
            name={"Projects"}
            displayEntities={
              projects ? projects.sort((a, b) => b.status - a.status) : []
            }
            displayComponent={(project) => (
              <ProjectCard
                key={project._id}
                project={project}
                icon={
                  <ClipboardDocumentListIcon className="w-6 text-indigo-500"></ClipboardDocumentListIcon>
                }
              ></ProjectCard>
            )}
          ></WrapperCard>
        </div>
      </div>
    </div>
  );
}
