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
import { Project } from "../../models/entities/Project";
import FilledButton from "../../ui/buttons/FilledButton";
import ProjectCard from "../../ui/cards/ProjectCard";
import TeamCard from "../../ui/cards/TeamCard";
import TextInput from "../../ui/inputs/TextInput";
import Dropdown from "../../ui/selection/Dropdown";

enum Sorting {
  STATUS = "Status",
  AZ = "A - Z",
  ZA = "Z - A",
  NEWEST = "Newest",
  OLDEST = "Oldest",
  TEAMS = "Teams",
}

export default function ProjectsOverviewPage() {
  const navigate = useNavigate();
  const { getAllUserProjects } = useProjectService();
  const [sortingOption, setSortingOption] = useState<string>(Sorting.STATUS);
  const [search, setSearch] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);

  const { data } = useQuery({
    queryKey: ["projects"],
    retry: 1,
    queryFn: async () => {
      const response = await getAllUserProjects();
      if (response.status == 403) {
        throw new Error("Token expired");
      }
      setProjects(response.data);
      return response.data;
    },
    onError: (error: any) => {
      navigate("/login", { replace: true });
    },
  });

  if (!data) {
    return <p>Loading</p>;
  }

  if (sortingOption === Sorting.STATUS) {
    projects.sort((a, b) => b.status - a.status);
  } else if (sortingOption === Sorting.AZ) {
    projects.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
    );
  } else if (sortingOption === Sorting.ZA) {
    projects.sort((a, b) =>
      a.name.toLowerCase() > b.name.toLowerCase() ? -1 : 1
    );
  } else if (sortingOption === Sorting.NEWEST) {
    projects.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));
  } else if (sortingOption === Sorting.OLDEST) {
    projects.sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1));
  } else if (sortingOption === Sorting.TEAMS) {
    projects.sort((a, b) =>
      a.team[0].name.toLowerCase() > b.team[0].name.toLowerCase() ? 1 : -1
    );
  }

  function handleSearchInputChange(newValue: string) {
    const originalArray = data ? data : projects;
    setProjects(
      originalArray.filter((project) =>
        project.name.toLowerCase().includes(newValue.toLowerCase())
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
        {projects ? (
          <div className="grid h-max w-full grid-cols-6 gap-2">
            {projects.map((project, index) => {
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
