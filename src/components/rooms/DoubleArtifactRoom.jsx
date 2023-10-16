import React from "react";
import { Wall, MainFloor, DisplayWall } from "../Environment";

export const DoubleArtifactRoom = ({ roomDepth, roomWidth, artifacts }) => {
    // Calculate new widths for the walls and floors
    const backWallWidth = roomWidth + 2.5;
    const leftWallWidth = 2;
    const rightWallWidth = 2;

    return (
        <>
            {/* Back Wall */}
            <Wall
                position={[-1, 5, 25]}
                args={[backWallWidth, backWallWidth / 2, 0.5]}
                width={backWallWidth}
                height={10}
                depth={0.5}
            />
            {/* Left Wall */}
            <Wall
                position={[-(roomWidth / 2) - 1, 2, 0]}
                args={[2, 5, 50]}
                width={leftWallWidth}
                height={5}
                depth={roomDepth}
            />
            {/* Right Wall */}
            <Wall
                position={[roomWidth / 2 - 1, 2, 0]}
                args={[2, 5, 50]}
                width={rightWallWidth}
                height={5}
                depth={roomDepth}
            />
            <MainFloor height={roomDepth} width={roomWidth} />

            <DisplayWall
                artifact={artifacts[0]}
                args={[10.5, 10, 0.5]}
                position={[8, 4, -10]}
                width={10}
                height={8}
                depth={0.5}
            />
            <DisplayWall
                artifact={artifacts[1]}
                args={[10.5, 10, 0.5]}
                position={[-8, 4, 10]}
                width={10}
                height={8}
                depth={0.5}
            />
        </>
    );
};
