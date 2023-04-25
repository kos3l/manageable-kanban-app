import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function Test() {
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["team"],
    queryFn: () => {
      return axiosPrivate.get("http://localhost:4000/api/team");
    },
  });

  return (
    <>
      test!{" "}
      <Link to={"../user-dashboard"}>
        <span className="ml-1 text-neutral-200/80 underline">Register</span>
      </Link>
    </>
  );
}
