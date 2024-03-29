import {
  TrashIcon,
  AtSymbolIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { QueryClient, useQuery } from "react-query";
import { useRouteLoaderData, useSubmit } from "react-router-dom";
import { Team } from "../../models/entities/Team";
import UserCard from "../../ui/cards/UserCard";
import WrapperCard from "../../ui/cards/WrapperCard";
import TextInput from "../../ui/inputs/TextInput";
import FilledButton from "../../ui/buttons/FilledButton";
import { User } from "../../models/entities/User";
import useUserService from "../../hooks/service/useUserService";
import { IUpdateTeamUsersDTO } from "../../models/dto/team/IUpdateTeamUsersDTO";
import TeamBanner from "../../ui/banner/TeamBanner";
import QueryKeys from "../../static/QueryKeys";

export const action =
  (
    queryClient: QueryClient,
    updateTeamMembers: (
      teamId: string,
      teamDto: IUpdateTeamUsersDTO
    ) => Promise<AxiosResponse<void, any>>
  ) =>
  async ({ request, params }: any) => {
    const formData = await request.formData();
    const usersFromData = Object.fromEntries(formData);
    const users = Object.values(usersFromData);
    const usersDto: IUpdateTeamUsersDTO = { users: JSON.parse(users[0]) };

    await updateTeamMembers(params.id, usersDto);
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.allTeams,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.userProfile,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.projectsWithTeams,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.userProjects,
    });
    await queryClient.invalidateQueries({
      queryKey: QueryKeys.user,
    });
    return true;
  };

export default function UpdateTeamMembersPage() {
  const team = useRouteLoaderData("selectedTeam") as Team;
  let submit = useSubmit();
  const { getUserByEmail } = useUserService();

  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchEnabled, setSearchEnabled] = useState<boolean>(false);

  const fetchedUser = useQuery({
    queryKey: QueryKeys.user,
    retry: 1,
    enabled: searchEnabled,
    queryFn: async () => {
      const response = await getUserByEmail(searchEmail);
      setSearchEnabled(false);
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

  function handleSearchClick() {
    if (!searchEmail) {
      setSearchEmail("email");
    }
    setSearchEnabled(true);
  }

  function handleRemoveUser(user: User) {
    const warning = confirm(
      "If you remove this user, they will not be able to access projects and tasks on this team, do you confirm?"
    );
    if (warning) {
      let formData = new FormData();
      const removedUser = team.users.filter((userId) => userId !== user._id);
      formData.append("user", JSON.stringify(removedUser));
      submit(formData, { method: "post" });
    }
  }

  function handleAddUser(fetchedUser: User) {
    let formData = new FormData();
    const users = [...team.users, fetchedUser._id];
    formData.append("user", JSON.stringify(users));
    submit(formData, { method: "post" });
  }

  useEffect(() => {
    document.addEventListener("keyup", onEnterPress);
    return () => {
      document.removeEventListener("keyup", onEnterPress);
    };
  }, [searchEmail]);

  function onEnterPress(event: KeyboardEvent) {
    if (event.key == "Enter") {
      handleSearchClick();
    }
  }

  if (!team) {
    return <>Loading</>;
  }

  return (
    <div className="flex w-full flex-wrap justify-center gap-3 md:w-3/4 md:justify-start 2xl:justify-center">
      <div className="w-full">
        <TeamBanner team={team}></TeamBanner>
      </div>
      <WrapperCard
        minHeight={false}
        name={"Current Members"}
        displayEntities={team.userModels ? team.userModels : []}
        displayComponent={(user) => (
          <UserCard
            noEmail={false}
            isActionCard={team.createdBy !== user._id}
            key={user._id}
            user={user}
            color="red"
            onClick={() => {
              handleRemoveUser(user);
            }}
            icon={<TrashIcon className="w-5 text-red-500"></TrashIcon>}
          ></UserCard>
        )}
      ></WrapperCard>
      <div className="flex h-max w-full flex-col gap-3 rounded-lg border border-neutral-600 p-3 sm:grow sm:basis-44">
        <div className="flex w-full items-center justify-between">
          <p className="font-serif tracking-wider">Invite New Member..</p>
        </div>
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap">
            <div className="flex basis-full sm:basis-56 ">
              <TextInput
                placeholder={"email"}
                icon={<AtSymbolIcon className="w-5"></AtSymbolIcon>}
                onChange={(val) => setSearchEmail(val)}
                name={"email"}
              ></TextInput>
            </div>
            <div className="flex grow">
              <FilledButton
                removeBackground={false}
                content={"Search"}
                onClick={() => handleSearchClick()}
                icon={
                  <MagnifyingGlassIcon className="w-4 text-neutral-300"></MagnifyingGlassIcon>
                }
              ></FilledButton>
            </div>
          </div>
          {fetchedUser && fetchedUser.data ? (
            <UserCard
              noEmail={false}
              isActionCard={!team.users.includes(fetchedUser.data._id)}
              user={fetchedUser.data}
              onClick={() => {
                handleAddUser(fetchedUser.data);
              }}
              color="indigo"
              icon={<PlusIcon className="w-5 text-indigo-500"></PlusIcon>}
            ></UserCard>
          ) : (
            <div className="flex h-16 w-full items-center  rounded-lg border border-neutral-600 bg-neutral-800/30 p-4">
              <p className="mt-1 text-lg tracking-wider opacity-30">
                No results..
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
