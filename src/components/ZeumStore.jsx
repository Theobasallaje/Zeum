import create from "zustand";

export const useZeumStore = create((set) => ({
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
