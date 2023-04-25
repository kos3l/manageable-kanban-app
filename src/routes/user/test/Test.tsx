import { useQuery } from "react-query";
import { Link, useNavigate } from "react-router-dom";
import { http } from "../../../client/HttpClient";

export default function Test() {
  const navigate = useNavigate();
  const client = http.initHttp(true);

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ["team"],
    queryFn: () => {
      return client.get("http://localhost:4000/api/team");
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
