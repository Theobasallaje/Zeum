import React from "react";
import { Wall, MainFloor, DisplayWall, Floor } from "../Environment";
import { useZeumStore } from "../ZeumStore";

export const FiveArtifactRoom = () => {
    const { getRoomDepth, roomWidth, artifacts } = useZeumStore();
    const roomDepth = getRoomDepth();
    return (
        <>
            {/* Back Wall */}
            <Wall position={[-25, 7.5, 38]} horizontal width={2} height={15} depth={100} />

            {/* Left Wall */}
            <Wall position={[-26, 2.5, -12.5]} width={2} height={5} depth={roomDepth - 25} />

            {/* Right Wall */}
            <Wall position={[24, 2.5, 0]} width={2} height={5} depth={roomDepth} />

            <Wall position={[-74, 2.5, 26]} width={2} height={5} depth={roomDepth / 3} />
            <Wall position={[-49, 2.5, 14]} horizontal width={2} height={5} depth={48} visible={false}/>

            <Floor position={[-49, 0, 26]} width={roomWidth} depth={roomDepth / 3} />
            <MainFloor height={roomDepth} width={roomWidth} />

            <DisplayWall
                artifact={artifacts[4]}
                args={[10.5, 10, 0.5]}
                position={[-55, 4, 35]}
                width={10}
                height={8}
                depth={0.5}
            />

            <DisplayWall
                artifact={artifacts[3]}
                args={[10.5, 10, 0.5]}
                position={[-35, 4, 35]}
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
