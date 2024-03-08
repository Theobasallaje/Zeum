import React from "react";
import { Wall, MainFloor, DisplayWall } from "../Environment";
import { useZeumStore } from "../ZeumStore";

export const TwoArtifactRoom = () => {
    const { getRoomDepth, roomWidth, artifacts } = useZeumStore();
    const roomDepth = getRoomDepth();
    const backWallWidth = roomWidth + 2.5;
    const leftWallWidth = 2;
    const rightWallWidth = 2;
    return (
        <>
            {/* Back Wall */}
            <Wall
                position={[-1, 5, 25]}
                width={backWallWidth}
                height={10}
                depth={0.5}
            />
            {/* Left Wall */}
            <Wall
                position={[-(roomWidth / 2) - 1, 2, 0]}
                width={leftWallWidth}
                height={5}
                depth={roomDepth}
            />
            {/* Right Wall */}
            <Wall
                position={[roomWidth / 2 - 1, 2, 0]}
                width={rightWallWidth}
                height={5}
                depth={roomDepth}
            />
            <MainFloor height={roomDepth} width={roomWidth} />

            <DisplayWall
                artifact={artifacts[1]}
                args={[10.5, 10, 0.5]}
                position={[-8, 4, 10]}
                width={10}
                height={8}
                depth={0.5}
            />
            <DisplayWall
                artifact={artifacts[0]}
                args={[10.5, 10, 0.5]}
                position={[8, 4, -10]}
                width={10}
                height={8}
                depth={0.5}
            />
        </>
    );
};
