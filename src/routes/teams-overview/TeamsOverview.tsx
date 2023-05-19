import {
  ChevronUpDownIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import { Team } from "../../models/entities/Team";
import FilledButton from "../../ui/buttons/FilledButton";
import TeamCard from "../../ui/cards/TeamCard";
import TextInput from "../../ui/inputs/TextInput";
import Dropdown from "../../ui/selection/Dropdown";

enum Sorting {
  PROJECTS = "Projects",
  AZ = "A - Z",
  ZA = "Z - A",
  NEWEST = "Newest",
  OLDEST = "Oldest",
}

export default function TeamsOverviewPage() {
  const navigate = useNavigate();
  const { getAllUserTeams } = useTeamService();
  const [sortingOption, setSortingOption] = useState<string>(Sorting.PROJECTS);
  const [search, setSearch] = useState<string>("");
  const [teams, setTeams] = useState<Team[]>([]);

  const { data } = useQuery({
    queryKey: ["team"],
    retry: 1,
    queryFn: async () => {
      const response = await getAllUserTeams();
      if (response.status == 401 || response.status == 403) {
        throw new Error("Token expired");
      }
      setTeams(response.data);
      return response.data;
    },
    onError: (error: any) => {
      navigate("/login", { replace: true });
    },
  });

  if (!data) {
    return <p>Loading</p>;
  }

  if (sortingOption === Sorting.PROJECTS) {
    teams.sort((a, b) => b.projects.length - a.projects.length);
  } else if (sortingOption === Sorting.AZ) {
    teams.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
  } else if (sortingOption === Sorting.ZA) {
    teams.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1
    );
  } else if (sortingOption === Sorting.NEWEST) {
    teams.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  } else if (sortingOption === Sorting.OLDEST) {
    teams.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  }

  function handleSearchInputChange(newValue: string) {
    const originalArray = data ? data : teams;
    setTeams(
      originalArray.filter((team) =>
        team.name.toLowerCase().includes(newValue.toLowerCase())
      )
    );
    setSearch(newValue);
  }

  return (
    <div className="grid h-max w-full grid-cols-4 gap-2 bg-gradient-to-b from-neutral-900 p-4 2xl:w-3/4">
      <div className="col-span-3 flex flex-wrap gap-x-2 gap-y-4">
        <div className="flex h-max flex-auto items-center">
          <TextInput
            name="search"
            placeholder={"Search..."}
            icon={
              <MagnifyingGlassIcon className="w-4 text-neutral-300"></MagnifyingGlassIcon>
            }
            value={search}
            onChange={(newValue: string) => {
              handleSearchInputChange(newValue);
            }}
          ></TextInput>
        </div>
        <div className="flex h-max w-[32.7%] items-center">
          <Dropdown
            color="indigo"
            name="sorting"
            value={sortingOption}
            onSelectValue={(val) => setSortingOption(val)}
            icon={
              <ChevronUpDownIcon className="w-4 text-indigo-600"></ChevronUpDownIcon>
            }
            placeholder="Select a team.."
            dropdownValues={Object.values(Sorting)}
          ></Dropdown>
        </div>
        {teams ? (
          <div className="grid w-full grid-cols-6 gap-2">
            {teams.map((team, index) => {
              return (
                <div
                  className="col-span-6 sm:col-span-3 md:col-span-2"
                  key={index}
                >
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
