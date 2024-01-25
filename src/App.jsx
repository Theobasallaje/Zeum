import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Scene } from "./components/Scene";
import { Home } from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NostrProvider } from "nostr-react";
import { ThemeProvider } from "@mui/material";
import { ZeumTheme } from "./ZeumTheme";
import { useZeumStore } from "./components/ZeumStore";
import { useDefaultRelaysQuery } from "./queries/Relays";

export const App = () => {
    const { signedInAs, setSignedInAs, preferredRelays, setPreferredRelays } = useZeumStore();
    const { nostrExtension } = useZeumStore();
    const { data: relayUrls, isLoading } = useDefaultRelaysQuery();


    if (!signedInAs && nostrExtension) {
        try {
            const publicKey = nostrExtension?.getPublicKey();
            setSignedInAs(publicKey);
        } catch (e) {
            console.error(e);
        }
    }

    if (signedInAs && nostrExtension) {
        try {
            const userRelays = nostrExtension?.getRelays();
            if (userRelays?.length) setPreferredRelays(userRelays);
        } catch (e) {
            console.error(e);
        }
    }

    // We get a bunch of relays from the API, but no reason to load them all
    const topRelays = useMemo(() => !!preferredRelays?.length ? preferredRelays : relayUrls?.slice?.(0, 15), [preferredRelays, relayUrls]);

    if (isLoading || !topRelays?.length) return "Loading Relays...";

    return (
      
            <NostrProvider relayUrls={topRelays}>
                <ThemeProvider theme={ZeumTheme}>
                    <Router>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/:eventId" element={<Scene />} />
                        </Routes>
                    </Router>
                </ThemeProvider>
                <ToastContainer />
            </NostrProvider>

    );
};
