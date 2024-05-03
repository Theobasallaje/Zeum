import React from "react";
import { DisplayWall, FullSizeRoom } from "../Environment";
import { useZeumStore } from "../ZeumStore";

export const TwelveArtifactRoom = () => {
    const { getRoomDepth, roomWidth, artifacts } = useZeumStore();
    const roomDepth = getRoomDepth();
    return (
        <>
            <FullSizeRoom roomDepth={roomDepth} roomWidth={roomWidth} />
            <DisplayWall artifact={artifacts[11]} position={[-30, 4, -27]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[10]} position={[-51, 4, -27]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[9]} position={[-72, 4, -27]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[8]} position={[-100, 4, -15]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[7]} position={[-90, 4, 0]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[6]} position={[-110, 4, 20]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[5]} position={[-72, 4, 60]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[4]} position={[-51, 4, 60]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[3]} position={[-30, 4, 60]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[2]} position={[0, 4, 20]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[1]} position={[-12, 4, 0]} width={10} height={8} depth={0.5} />
            <DisplayWall artifact={artifacts[0]} position={[8, 4, -20]} width={10} height={8} depth={0.5} />
        </>
    );
};
