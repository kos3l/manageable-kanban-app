import { Link } from "react-router-dom";

export default function UserDashboard() {
  return (
    <>
      Hello logged in user!{" "}
      <Link to={"../test"}>
        <span className="ml-1 text-neutral-200/80 underline">Register</span>
      </Link>
      <Link to={"/login"}>
        <span className="ml-1 text-neutral-200/80 underline">login</span>
      </Link>
    </>
  );
}
