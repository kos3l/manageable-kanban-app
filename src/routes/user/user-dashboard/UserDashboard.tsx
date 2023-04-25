import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { http } from "../../../auth/client/HttpClient";
import useAuth from "../../../auth/hooks/useAuth";

export default function UserDashboard() {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const client = http.initHttp(true);

  const fetchTeams = useQuery({
    queryKey: ["team"],
    retry: 1,
    queryFn: async () => {
      const response = await client.get("http://localhost:4000/api/team");
      if (response.status == 401 || response.status == 403) {
        throw new Error("Token expired");
      }
      return response.data;
    },
    onError: (error: any) => {
      navigate("/login", { replace: true });
    },
  });

  const logout = useQuery({
    queryKey: ["logout"],
    retry: 1,
    queryFn: async () => {
      await client.get("http://localhost:4000/api/auth/logout");
    },
    onSuccess: (data: any) => {
      setAuth((prev) => {
        return { accessToken: "" };
      });
    },
    enabled: false,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      Hello logged in user!{" "}
      <Link to={"../test"}>
        <span className="ml-1 text-neutral-200/80 underline">Register</span>
      </Link>
      <button onClick={() => logout.refetch()}>logout</button>
    </>
  );
}
