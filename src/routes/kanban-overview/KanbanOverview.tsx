import {
  ChevronUpDownIcon,
  ListBulletIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useProjectService from "../../hooks/service/useProjectService";
import QueryKeys from "../../static/QueryKeys";
import KanbanCard from "../../ui/cards/KanbanCard";
import TextInput from "../../ui/inputs/TextInput";
import Dropdown from "../../ui/selection/Dropdown";

enum Sorting {
  AZ = "A - Z",
  ZA = "Z - A",
  NEWEST = "Newest",
  OLDEST = "Oldest",
}

export default function KanbanOverview() {
  const navigate = useNavigate();
  const { getAllUserProjects } = useProjectService();
  const [sortingOption, setSortingOption] = useState<string>(Sorting.AZ);
  const [search, setSearch] = useState<string>("");

  const { data } = useQuery({
    queryKey: QueryKeys.userProjects,
    retry: 1,
    queryFn: async () => {
      const response = await getAllUserProjects();
      if (response.status == 403) {
        throw new Error("Token expired");
      }
      return response.data;
    },
    onError: (error: any) => {
      navigate("/login", { replace: true });
    },
  });

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
            onChange={(newValue: string) => setSearch(newValue)}
          ></TextInput>
        </div>
        <div className="flex h-max w-[32.7%] items-center">
          <Dropdown
            placeholder="Select a team.."
            color="indigo"
            name="sorting"
            value={sortingOption}
            onSelectValue={(val) => setSortingOption(val)}
            icon={
              <ChevronUpDownIcon className="w-4 text-indigo-600"></ChevronUpDownIcon>
            }
            dropdownValues={Object.values(Sorting)}
          ></Dropdown>
        </div>
        {data ? (
          <div className="grid h-max w-full grid-cols-6 gap-2">
            {data.map((project, index) => {
              return (
                <div
                  className="col-span-6 sm:col-span-3 md:col-span-2"
                  key={index}
                >
                  <KanbanCard
                    project={project}
                    icon={
                      <ListBulletIcon className="w-6 text-neutral-400"></ListBulletIcon>
                    }
                  ></KanbanCard>
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
