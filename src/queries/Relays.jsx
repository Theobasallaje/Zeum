import { useQuery } from "react-query";

export const useDefaultRelaysQuery = () =>
    useQuery("defaultRelays", async () => {
        const response = await fetch("https://api.nostr.watch/v1/online");
        return response?.json();
    });
