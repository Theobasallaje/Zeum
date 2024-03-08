import React from "react";
import { DisplayWall, FullSizeRoom } from "../Environment";
import { useZeumStore } from "../ZeumStore";

export const TwelveArtifactRoom = () => {
    const { getRoomDepth, roomWidth, artifacts } = useZeumStore();
    const roomDepth = getRoomDepth();
    return (
        <>
            <FullSizeRoom roomDepth={roomDepth} roomWidth={roomWidth} />

            <DisplayWall
                artifact={artifacts[11]}
                args={[10.5, 10, 0.5]}
                position={[-30, 4, -27]}
                width={10}
                height={8}
                depth={0.5}
            />


            <DisplayWall
                artifact={artifacts[10]}
                args={[10.5, 10, 0.5]}
                position={[-51, 4, -27]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[9]}
                args={[10.5, 10, 0.5]}
                position={[-72, 4, -27]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[8]}
                args={[10.5, 10, 0.5]}
                position={[-100, 4, -15]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[7]}
                args={[10.5, 10, 0.5]}
                position={[-90, 4, 0]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[6]}
                args={[10.5, 10, 0.5]}
                position={[-110, 4, 20]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[5]}
                args={[10.5, 10, 0.5]}
                position={[-72, 4, 60]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[4]}
                args={[10.5, 10, 0.5]}
                position={[-51, 4, 60]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[3]}
                args={[10.5, 10, 0.5]}
                position={[-30, 4, 60]}
                width={10}
                height={8}
                depth={0.5}
            />
            <DisplayWall
                artifact={artifacts[2]}
                args={[10.5, 10, 0.5]}
                position={[0, 4, 20]}
                width={10}
                height={8}
                depth={0.5}
            />
            <DisplayWall
                artifact={artifacts[1]}
                args={[10.5, 10, 0.5]}
                position={[-12, 4, 0]}
                width={10}
                height={8}
                depth={0.5}
            />
            <DisplayWall
                artifact={artifacts[0]}
                args={[10.5, 10, 0.5]}
                position={[8, 4, -20]}
                width={10}
                height={8}
                depth={0.5}
            />
        </>
    );
};
