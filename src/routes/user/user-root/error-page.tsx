import { useRouteError } from "react-router-dom";

export default function ErrorUserPage() {
  const error: any = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1>Logeed in user!</h1>
      <p>You made a mistake!</p>
      <p>
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
