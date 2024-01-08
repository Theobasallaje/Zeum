import React, { useEffect, useMemo, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Scene } from "./components/Scene";
import { Home } from "./components/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NostrProvider } from "nostr-react";
import { ThemeProvider } from "@mui/material";
import { ZeumTheme } from "./ZeumTheme";

export const App = () => {
    const [relayUrls, setRelayUrls] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch("https://api.nostr.watch/v1/online");
                if (!response.ok) {
                    throw new Error("Bad response from relay server");
                }
                const data = await response.json();
                setRelayUrls(data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // We get a bunch of relays from the API, but no reason to load them all
    const topRelays = useMemo(() => relayUrls?.slice(0, 10), [relayUrls]);

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
