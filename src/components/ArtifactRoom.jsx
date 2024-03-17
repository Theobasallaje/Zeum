import { useZeumStore } from "./ZeumStore";

export const ArtifactRoom = () => {
    const { getRoomConfiguration } = useZeumStore();

    return getRoomConfiguration();
}