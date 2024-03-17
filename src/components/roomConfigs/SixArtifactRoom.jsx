import React from "react";
import { Wall, MainFloor, DisplayWall, Floor } from "../Environment";
import { useZeumStore } from "../ZeumStore";

export const SixArtifactRoom = () => {
    const { getRoomDepth, roomWidth, artifacts } = useZeumStore();
    const roomDepth = getRoomDepth();

    const INNER_WALL_MAX_DEPTH = (roomDepth * 2) / 3 + 2;

    return (
        <>
            {/* Back Wall */}
            <Wall position={[-25, 7.5, 38]} horizontal width={2} height={15} depth={100} />

            {/* Left Wall */}
            <Wall position={[24, 2.5, 0]} width={2} height={5} depth={roomDepth} />

            {/* Inner Left Wall */}
            <Wall position={[-26, 2.5, -12]} width={2} height={5} depth={INNER_WALL_MAX_DEPTH} />

            {/* Inner Right Wall */}
            <Wall position={[-74, 2.5, 27]} width={2} height={5} depth={24} />

            {/* Hallway Front Wall */}
            <Wall
                position={[-50.5, 2.5, 14]}
                horizontal
                width={2}
                height={5}
                depth={INNER_WALL_MAX_DEPTH - 1}
                visible={false}
            />

            {/* Hallway Floor */}
            <Floor position={[-50, 0, 27]} width={roomWidth} depth={roomDepth / 3 - 2} />

            <MainFloor height={roomDepth} width={roomWidth} />
            
            <DisplayWall artifact={artifacts[5]} position={[-63, 4, 32]} />
            <DisplayWall artifact={artifacts[4]} position={[-48, 4, 32]} />
            <DisplayWall artifact={artifacts[3]} position={[-33, 4, 32]} />
            <DisplayWall artifact={artifacts[2]} position={[0, 4, 20]} />
            <DisplayWall artifact={artifacts[1]} position={[-12, 4, 0]} />
            <DisplayWall artifact={artifacts[0]} position={[8, 4, -20]} />
        </>
    );
};
