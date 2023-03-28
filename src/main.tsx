import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";

import Root from "./routes/root/root";
import ErrorPage from "./routes/root/error-page";

import "./index.css";
import Test from "./routes/test/test";
import User from "./routes/user/user";

const router = createBrowserRouter([
  {
    path: "/",
    // if logged in use ternary to render the right page element
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        errorElement: <ErrorPage />,
        children: [
          // { index: true, element: <Index /> },
          {
            path: "test/",
            element: <Test />,
          },
          /* the rest of the routes */
        ],
      },
    ],
  },
]);

const queryClient = new QueryClient();
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
