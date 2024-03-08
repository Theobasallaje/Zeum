import React from "react";
import create from "zustand";
import { TwoArtifactRoom } from "./rooms/TwoArtifactRoom";
import { FiveArtifactRoom } from "./rooms/FiveArtifactRoom";
import { FourArtifactRoom } from "./rooms/FourArtifactRoom";
import { SingleArtifactRoom } from "./rooms/SingleArtifactRoom";
import { ThreeArtifactRoom } from "./rooms/ThreeArtifactRoom";
import { TwelveArtifactRoom } from "./rooms/TwelveArtifactRoom";
import { EightArtifactRoom } from "./rooms/EightArtifactRoom";
import { ElevenArtifactRoom } from "./rooms/ElevenArtifactRoom";
import { NineArtifactRoom } from "./rooms/NineArtifactRoom";
import { SevenArtifactRoom } from "./rooms/SevenArtifactRoom";
import { SixArtifactRoom } from "./rooms/SixArtifactRoom";
import { TenArtifactRoom } from "./rooms/TenArtifactRoom";

export const useZeumStore = create((set, get) => ({
    nostrExtension: window?.nostr,
    signedInAs: null,
    preferredRelays: [],
    setPreferredRelays: (preferredRelays) => set({ preferredRelays }),
    setSignedInAs: (signedInAs) => set({ signedInAs }),
    isContextActionActive: false,
    setIsContextActionActive: (isContextActionActive) => set({ isContextActionActive }),
    isPlayerInRangeForContextAction: false,
    setIsPlayerInRangeForContextAction: (isPlayerInRangeForContextAction) => set({ isPlayerInRangeForContextAction }),
    playerClosePosition: null,
    setPlayerClosePosition: (playerClosePosition) => set({ playerClosePosition }),
    artifactPosition: null,
    setArtifactPosition: (artifactPosition) => set({ artifactPosition }),
    deactivateCloseUp: () =>
        set({
            isPlayerInRangeForContextAction: false,
            playerClosePosition: null,
            isContextActionActive: false,
        }),
    numberOfArtifacts: null,
    artifacts: [],
    setArtifacts: (artifacts) => set({ artifacts }),
    setNumberOfArtifacts: (numberOfArtifacts) => set({ numberOfArtifacts }),
    roomWidth: 50,
    getRoomDepth: () => {
        const artifacts = get()?.artifacts;
        if (!artifacts?.length) return;
        if (artifacts?.length === 1) return 50;
        if (artifacts?.length === 2) return  62.5;
        if (artifacts?.length >= 3 && artifacts?.length < 10) return 78.125;
        if (artifacts?.length >= 10) return 125;
    },
    getArtifactRoom: () => {
        const artifacts = get()?.artifacts;
        if (!artifacts?.length) return;
        switch (artifacts?.length) {
            case 1:
                return <SingleArtifactRoom />;
            case 2:
                return <TwoArtifactRoom />;
            case 3:
                return <ThreeArtifactRoom />;
            case 4:
                return <FourArtifactRoom />;
            case 5:
                return <FiveArtifactRoom />;
            case 6:
                return <SixArtifactRoom />;
            case 7:
                return <SevenArtifactRoom />;
            case 8:
                return <EightArtifactRoom />;
            case 9:
                return <NineArtifactRoom />;
            case 10:
                return <TenArtifactRoom />;
            case 11:
                return <ElevenArtifactRoom />;
            case 12:
                return <TwelveArtifactRoom />;
            default:
                return <TwelveArtifactRoom />
        }
    },
}));
