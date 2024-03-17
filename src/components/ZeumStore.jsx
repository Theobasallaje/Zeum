import React from "react";
import create from "zustand";
import { TwoArtifactRoom } from "./roomConfigs/TwoArtifactRoom";
import { FiveArtifactRoom } from "./roomConfigs/FiveArtifactRoom";
import { FourArtifactRoom } from "./roomConfigs/FourArtifactRoom";
import { SingleArtifactRoom } from "./roomConfigs/SingleArtifactRoom";
import { ThreeArtifactRoom } from "./roomConfigs/ThreeArtifactRoom";
import { TwelveArtifactRoom } from "./roomConfigs/TwelveArtifactRoom";
import { EightArtifactRoom } from "./roomConfigs/EightArtifactRoom";
import { ElevenArtifactRoom } from "./roomConfigs/ElevenArtifactRoom";
import { NineArtifactRoom } from "./roomConfigs/NineArtifactRoom";
import { SevenArtifactRoom } from "./roomConfigs/SevenArtifactRoom";
import { SixArtifactRoom } from "./roomConfigs/SixArtifactRoom";
import { TenArtifactRoom } from "./roomConfigs/TenArtifactRoom";

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
    showJoystick: false,
    setShowJoystick: (showJoystick) => set({ showJoystick }),
    getRoomConfiguration: () => {
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
