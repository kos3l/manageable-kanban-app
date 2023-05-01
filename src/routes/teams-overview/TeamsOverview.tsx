import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import ActionButton from "../../ui/buttons/ActionButton";
import FilledButton from "../../ui/buttons/FilledButton";
import TeamCard from "../../ui/cards/TeamCard";
import TextInput from "../../ui/inputs/TextInput";

export default function TeamsOverview() {
  const navigate = useNavigate();
  const { getAllUserTeams } = useTeamService();
  const [search, setSearch] = useState<string>("");
  const { data } = useQuery({
    queryKey: ["team"],
    retry: 1,
    queryFn: async () => {
      const response = await getAllUserTeams();
      if (response.status == 401 || response.status == 403) {
        throw new Error("Token expired");
      }
      return response.data;
    },
    onError: (error: any) => {
      navigate("/login", { replace: true });
    },
  });

  return (
    <div className="grid w-full grid-cols-4 gap-2">
      <div className="col-span-1">
        <FilledButton
          content={"Create A Team"}
          icon={<PlusIcon className="w-4 text-neutral-300"></PlusIcon>}
        ></FilledButton>
      </div>
      <div className="col-span-3 flex flex-wrap gap-x-2 gap-y-4">
        <div className="flex h-max flex-auto items-center">
          <TextInput
            placeholder={"Search..."}
            icon={
              <MagnifyingGlassIcon className="w-4 text-neutral-300"></MagnifyingGlassIcon>
            }
            onChange={(newValue: string) => setSearch(newValue)}
          ></TextInput>
        </div>
        <div className="flex h-max w-[32.7%] items-center">
          <TextInput
            placeholder={"Search..."}
            icon={
              <ChevronUpDownIcon className="w-4 text-neutral-300"></ChevronUpDownIcon>
            }
            onChange={(newValue: string) => setSearch(newValue)}
          ></TextInput>
        </div>
        {data ? (
          <div className="grid w-full grid-cols-6 gap-2">
            {data.map((team) => {
              return (
                <div className="col-span-6 sm:col-span-3 md:col-span-2">
                  <TeamCard
                    team={team}
                    icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
                  ></TeamCard>
                </div>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
