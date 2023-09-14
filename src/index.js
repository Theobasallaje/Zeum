import React from "react";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { NostrProvider } from "nostr-react";

const root = createRoot(document.getElementById("root"));
const relayUrls = ["wss://relayable.org	", "wss://lightningrelay.com", "wss://relay.nostr.band/"];

root.render(
    <NostrProvider relayUrls={relayUrls}>
        <App />
    </NostrProvider>
);
