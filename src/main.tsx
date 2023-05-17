import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { HTML5Backend } from "react-dnd-html5-backend";
import "./index.css";
import { AuthProvider } from "./auth/context/AuthContext";
import App from "./App";
import { DndProvider } from "react-dnd";

const queryClient = new QueryClient({});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DndProvider backend={HTML5Backend}>
          <App queryClient={queryClient} />
        </DndProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
