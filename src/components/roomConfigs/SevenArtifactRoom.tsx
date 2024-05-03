import React from "react";
import { Wall, MainFloor, DisplayWall, Floor } from "../Environment";
import { useZeumStore } from "../ZeumStore";

export const SevenArtifactRoom = () => {
    const { getRoomDepth, roomWidth, artifacts } = useZeumStore();
    const roomDepth = getRoomDepth();
    const INNER_WALL_MAX_DEPTH = (roomDepth * 2) / 3 + 2;
    return (
        <>
            {/* 1st Room Back Wall */}
            <Wall position={[0, 7.5, 38]} horizontal width={2} height={15} depth={50} />

            {/* Left Wall */}
            <Wall position={[24, 2.5, 0]} width={2} height={5} depth={roomDepth} />

            {/* Inner Left Wall */}
            <Wall position={[-26, 2.5, -12]} width={2} height={5} depth={INNER_WALL_MAX_DEPTH} />

            {/* Inner Right Wall */}
            <Wall position={[-75, 2.5, 7.25]} width={2} height={5} depth={15.5} />

            {/* Right Wall */}
            <Wall position={[-124, 2.5, 19]} width={2} height={5} depth={roomDepth / 2} />

            <Wall
                position={[-50.5, 2.5, 14]}
                horizontal
                width={2}
                height={5}
                depth={INNER_WALL_MAX_DEPTH - 1}
                visible={false}
            />

            {/* Hallway Back Wall */}
            <Wall position={[-50, 7.5, 38]} horizontal width={2} height={15} depth={50} />

            {/* Hallway Floor */}
            <Floor position={[-50, 0, 27]} width={roomWidth} depth={roomDepth / 3 - 2} />

            {/* 2nd Room Back Wall */}
            <Wall position={[-100, 7.5, 38]} horizontal width={2} height={15} depth={50} />

            {/* 2nd Room Floor */}
            <Floor position={[-100, 0, 19]} width={roomWidth} depth={roomDepth / 2} />

            {/* 2nd Room Front Wall */}
            <Wall position={[-100, 2.5, 0]} horizontal width={2} height={5} depth={50} visible={false} />

            <MainFloor height={roomDepth} width={roomWidth} />

            <DisplayWall artifact={artifacts[6]} position={[-110, 4, 20]} width={10} height={8} depth={0.5} />

            <DisplayWall artifact={artifacts[5]} position={[-72, 4, 35]} width={10} height={8} depth={0.5} />

            <DisplayWall artifact={artifacts[4]} position={[-51, 4, 35]} width={10} height={8} depth={0.5} />

            <DisplayWall artifact={artifacts[3]} position={[-30, 4, 35]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[2]} position={[0, 4, 20]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[1]} position={[-12, 4, 0]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[0]} position={[8, 4, -20]} width={10} height={8} depth={0.5} />
        </>
    );
};
