import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./index.css";
import { NostrProvider } from "nostr-react";

const root = createRoot(document.getElementById("root"));
const relayUrls = [
    "wss://relayable.org",
    //"wss://lightningrelay.com",
    "wss://relay.nostr.band",
    "wss://nostr.wine",
    //"wss://brb.io",
    "wss://at.nostrworks.com",
];

root.render(
    <NostrProvider relayUrls={relayUrls}>
        <App />
    </NostrProvider>
);
