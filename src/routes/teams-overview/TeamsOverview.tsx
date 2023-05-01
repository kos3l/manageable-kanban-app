import { PlusIcon, UsersIcon } from "@heroicons/react/24/solid";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import useTeamService from "../../hooks/service/useTeamService";
import ActionButton from "../../ui/buttons/ActionButton";
import FilledButton from "../../ui/buttons/FilledButton";
import TeamCard from "../../ui/cards/TeamCard";

export default function TeamsOverview() {
  const navigate = useNavigate();
  const { getAllUserTeams } = useTeamService();

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
    <div className="grid w-full grid-cols-6 gap-3">
      <div className="col-span-1">
        <FilledButton
          content={"Create A Team"}
          icon={<PlusIcon className="w-4 text-neutral-300"></PlusIcon>}
        ></FilledButton>
      </div>
      <div className="col-span-4">
        {data ? (
          <div className="grid w-full grid-cols-4 gap-2">
            {data.map((team) => {
              return (
                <TeamCard
                  team={team}
                  icon={<UsersIcon className="w-6 text-pink-500"></UsersIcon>}
                ></TeamCard>
              );
            })}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="col-span-1"></div>
    </div>
  );
}
