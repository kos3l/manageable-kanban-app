import {
  ChevronUpDownIcon,
  ClipboardDocumentIcon,
  ClipboardDocumentListIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { useState } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useProjectService from "../../hooks/service/useProjectService";
import useTeamService from "../../hooks/service/useTeamService";
import FilledButton from "../../ui/buttons/FilledButton";
import ProjectCard from "../../ui/cards/ProjectCard";
import TeamCard from "../../ui/cards/TeamCard";
import TextInput from "../../ui/inputs/TextInput";
import Dropdown from "../../ui/selection/Dropdown";

enum Sorting {
  AZ = "A - Z",
  ZA = "Z - A",
  NEWEST = "Newest",
  OLDEST = "Oldest",
}

export default function ProjectsOverview() {
  const navigate = useNavigate();
  const { getAllUserProjects } = useProjectService();
  const [sortingOption, setSortingOption] = useState<string>(Sorting.AZ);
  const [search, setSearch] = useState<string>("");

  const { data } = useQuery({
    queryKey: ["projects"],
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
    <div className="grid h-max w-full grid-cols-4 gap-2">
      <div className="col-span-1">
        <FilledButton
          content={"Create A Project"}
          icon={<PlusIcon className="w-4 text-neutral-300"></PlusIcon>}
        ></FilledButton>
      </div>
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
            color="indigo"
            value={sortingOption}
            onChange={(val) => setSortingOption(val)}
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
                  <ProjectCard
                    project={project}
                    icon={
                      <ClipboardDocumentListIcon className="w-6 text-indigo-500"></ClipboardDocumentListIcon>
                    }
                  ></ProjectCard>
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
