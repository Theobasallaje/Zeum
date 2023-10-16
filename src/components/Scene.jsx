import React, { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, useBox } from "@react-three/cannon";
import { ExitPlane, Overlay } from "./Environment";
import { PlayerControls } from "./PlayerControls";
import { SingleArtifactRoom } from "./rooms/SingleArtifactRoom";
import { DoubleArtifactRoom } from "./rooms/DoubleArtifactRoom";
import { TripleArtifactRoom } from "./rooms/TripleArtifactRoom";
import { OrbitControls } from "@react-three/drei";

export const Scene = ({ eventId, images, handleExit }) => {
    const roomDepth = useMemo(() => {
        if (images?.length === 1) return 50;
        if (images?.length === 2) return 62.5;
        if (images?.length >= 3) return 78.125;
    }, [images]);

    const isTouchScreen = useMemo(() => {
        return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
    }, []);

    return eventId ? (
        <>
            <Canvas
                dpr={[1, 2]}
                camera={{ far: 100, near: 1, position: [0, 10, -10], zoom: 50, fov: 50 }}
                orthographic
                shadows
            >
                <OrbitControls />
                <ambientLight intensity={2} position={[0, 10, 4]} />
                <Physics iterations={15} gravity={[0, -15, 0]}>
                    {images?.length === 1 && (
                        <SingleArtifactRoom artifact={images[0]} roomDepth={roomDepth} roomWidth={50} />
                    )}
                    {images?.length === 2 && <DoubleArtifactRoom artifacts={images} roomDepth={roomDepth} roomWidth={50} />}
                    {images?.length >= 3 && <TripleArtifactRoom artifacts={images} roomDepth={roomDepth} roomWidth={50} />}
                    <PlayerControls showJoystick={isTouchScreen} />
                    <ExitPlane roomHeight={roomDepth} handleExit={handleExit} />
                </Physics>
            </Canvas>
            <Overlay />
        </>
    ) : (
        <></>
    );
};
