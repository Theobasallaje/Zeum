import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";

const root = createRoot(document.getElementById("root"));

root.render(
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <App />
    </ErrorBoundary>
);
