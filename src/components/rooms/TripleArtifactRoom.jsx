import React from "react";
import { Wall, MainFloor, DisplayWall } from "../Environment";

export const TripleArtifactRoom = ({ roomDepth, roomWidth, artifacts }) => {
    return (
        <>
            {/* Back Wall */}
            <Wall position={[0, 5, 25]} args={[roomWidth, roomWidth / 2, 0.5]} width={roomWidth} height={10} depth={0.5} />
            {/* Left Wall */}
            <Wall position={[-24, 2.5, 0]} args={[2, 5, roomDepth]} width={2} height={5} depth={roomDepth} />
            {/* Right Wall */}
            <Wall position={[24, 2.5, 0]} args={[2, 5, roomDepth]} width={2} height={5} depth={roomDepth} />
            <MainFloor height={roomDepth} width={roomWidth} />
            <DisplayWall
                artifact={artifacts[0]}
                args={[10.5, 10, 0.5]}
                position={[0, 4, 10]}
                width={10}
                height={8}
                depth={0.5}
            />
            <DisplayWall
                artifact={artifacts[1]}
                args={[10.5, 10, 0.5]}
                position={[-8, 4, -5]}
                width={10}
                height={8}
                depth={0.5}
            />
            <DisplayWall
                artifact={artifacts[2]}
                args={[10.5, 10, 0.5]}
                position={[8, 4, -15]}
                width={10}
                height={8}
                depth={0.5}
            />
        </>
    );
};
