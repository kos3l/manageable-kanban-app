import {
  IdentificationIcon,
  Bars3CenterLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  UsersIcon,
  TrashIcon,
  AtSymbolIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { QueryClient, useQuery } from "react-query";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
  useSubmit,
} from "react-router-dom";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";
import { Team } from "../../models/entities/Team";
import ActionButton from "../../ui/buttons/ActionButton";
import UserCard from "../../ui/cards/UserCard";
import WrapperCard from "../../ui/cards/WrapperCard";
import TextareaInput from "../../ui/inputs/TextareaInput";
import TextInput from "../../ui/inputs/TextInput";
import avatar from "../../assets/avatar.png";
import FilledButton from "../../ui/buttons/FilledButton";
import { User } from "../../models/entities/User";
import useUserService from "../../hooks/service/useUserService";
import { IUpdateTeamUsersDTO } from "../../models/dto/team/IUpdateTeamUsersDTO";
import DisplayField from "../../ui/display-field/DisplayField";

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
      queryKey: ["team", "teams", "projects", "user", "profile"],
    });
    return true;
  };

export default function UpdateTeamMembersPage() {
  const team = useRouteLoaderData("selectedTeam") as Team;
  const { getUserByEmail } = useUserService();
  let submit = useSubmit();

  if (!team) {
    return <>Loading</>;
  }

  const [searchEmail, setSearchEmail] = useState<string>("");
  const [searchEnabled, setSearchEnabled] = useState<boolean>(false);

  const fetchedUser = useQuery({
    queryKey: ["user", "email"],
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

  const teamCreator = team.userModels?.find(
    (user) => user._id == team.createdBy
  );

  return (
    <div className="flex w-full flex-wrap justify-center gap-3 md:w-3/4 md:justify-start 2xl:justify-center">
      <div className="flex h-max w-full items-center gap-3 rounded-lg border border-neutral-600 bg-neutral-800/50 p-3">
        <div className="w-20 overflow-hidden rounded-lg border border-neutral-600  sm:border-0 ">
          <img src={avatar} alt="" className="h-full w-full object-contain" />
        </div>
        <div className="flex w-max flex-col gap-2">
          <DisplayField
            label={"Team:"}
            value={team.name}
            placeholder={""}
          ></DisplayField>
          <DisplayField
            label={"Created By"}
            value={teamCreator?.firstName + " " + teamCreator?.lastName}
            placeholder={""}
          ></DisplayField>
        </div>
      </div>
      <WrapperCard
        name={"Current Members"}
        displayEntities={team.userModels ? team.userModels : []}
        displayComponent={(user) => (
          <UserCard
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
