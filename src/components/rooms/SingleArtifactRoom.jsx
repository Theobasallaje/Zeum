import React from "react";
import { Wall, MainFloor, DisplayWall } from "../Environment";

export const SingleArtifactRoom = ({ artifact, roomDepth, roomWidth }) => {
    return (
        <>
            {/* Back Wall */}
            <Wall position={[0, 5, 25]} args={[roomWidth, 25, 0.5]} width={roomWidth} height={10} depth={0.5} />
            {/* Left Wall */}
            <Wall position={[-24, 2.5, 0]} args={[2, 5, roomDepth]} width={2} height={5} depth={roomDepth} />
            {/* Right Wall */}
            <Wall position={[24, 2.5, 0]} args={[2, 5, roomDepth]} width={2} height={5} depth={roomDepth} />
            <MainFloor height={50} width={50} />
            <DisplayWall
                artifact={artifact}
                args={[10.5, 10, 0.5]}
                position={[0, 4, 10]}
                width={10}
                height={8}
                depth={0.5}
            />
        </>
    );
};
