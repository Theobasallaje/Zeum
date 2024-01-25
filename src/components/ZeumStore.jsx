import create from "zustand";

export const useZeumStore = create((set) => ({
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
}));
