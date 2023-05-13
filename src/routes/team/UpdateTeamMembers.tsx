import {
  IdentificationIcon,
  Bars3CenterLeftIcon,
  CheckCircleIcon,
  XMarkIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { AxiosResponse } from "axios";
import { useState } from "react";
import { QueryClient } from "react-query";
import {
  Form,
  redirect,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { ICreateTeamDTO } from "../../models/dto/team/ICreateTeamDTO";
import { Team } from "../../models/entities/Team";
import ActionButton from "../../ui/buttons/ActionButton";
import UserCard from "../../ui/cards/UserCard";
import WrapperCard from "../../ui/cards/WrapperCard";
import TextareaInput from "../../ui/inputs/TextareaInput";
import TextInput from "../../ui/inputs/TextInput";

// export const action =
//   (
//     queryClient: QueryClient,
//     createTeam: (teamDto: ICreateTeamDTO) => Promise<AxiosResponse<Team, any>>
//   ) =>
//   async ({ request }: any) => {
//     const formData = await request.formData();
//     const team = Object.fromEntries(formData) as ICreateTeamDTO;
//     const newTeam = await createTeam(team);
//     await queryClient.invalidateQueries({
//       queryKey: ["team", "teams", "projects", "profile"],
//     });
//     return redirect(`/user/teams/${newTeam.data._id}`);
//   };

export default function UpdateTeamMembersPage() {
  const team = useRouteLoaderData("selectedTeam") as Team;
  const navigate = useNavigate();
  console.log(team);
  if (!team) {
    return <>Loading</>;
  }

  const [users, setUsers] = useState<string[]>(team.users);

  return (
    <div className="flex w-full justify-center md:justify-start 2xl:justify-center">
      <WrapperCard
        name={"Members"}
        displayEntities={team.userModels ? team.userModels : []}
        displayComponent={(user) => (
          <UserCard
            key={user._id}
            user={user}
            icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
          ></UserCard>
        )}
      ></WrapperCard>
    </div>
  );
}
