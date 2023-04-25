import { useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

export default function UserDashboard() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { auth } = useAuth();
  console.log(auth);
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["team"],
    retry: 1,
    queryFn: async () => {
      const response = await axiosPrivate.get("http://localhost:4000/api/team");

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
    <>
      Hello logged in user!{" "}
      <Link to={"../test"}>
        <span className="ml-1 text-neutral-200/80 underline">Register</span>
      </Link>
    </>
  );
}
