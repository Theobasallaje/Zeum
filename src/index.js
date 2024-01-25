import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import { QueryClient, QueryClientProvider } from "react-query";

const root = createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <QueryClientProvider client={queryClient}>
            <App />
        </QueryClientProvider>
    </ErrorBoundary>
);
