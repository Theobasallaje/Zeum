import React, { useMemo, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics, useBox } from "@react-three/cannon";
import { Wall, DisplayWall, MainFloor, ExitPlane, Overlay } from "./Environment";
import { PlayerControls } from "./PlayerControls";

export const Scene = ({ eventId, images, handleExit }) => {
    const isTouchScreen = useMemo(() => {
        return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
    }, []);

    const firstImage = useMemo(() => {
        return images?.length > 0 ? images[0] : undefined;
    }, [images]);

    return eventId ? (
        <>
            <Canvas
                dpr={[1, 2]}
                camera={{ far: 100, near: 1, position: [0, 10, -10], zoom: 50, fov: 50 }}
                orthographic
                shadows
            >
                <ambientLight intensity={2} position={[0, 10, 4]} />
                <pointLight position={[0, 8, 4]} color="white" intensity={75} castShadow />

                <Physics iterations={15} gravity={[0, -15, 0]}>
                    {/* Back Wall */}
                    <Wall position={[0, 5, 25]} args={[50, 25, 0.5]} width={50} height={10} depth={0.5} />
                    {/* Left Wall */}
                    <Wall position={[-24, 2.5, 0]} args={[2, 5, 50]} width={2} height={5} depth={50} />
                    {/* Right Wall */}
                    <Wall position={[24, 2.5, 0]} args={[2, 5, 50]} width={2} height={5} depth={50} />
                    <MainFloor />
                    <DisplayWall
                        image={firstImage}
                        args={[12, 10, 0.5]}
                        position={[0, 4, 10]}
                        width={10}
                        height={8}
                        depth={0.5}
                    />
                    <PlayerControls showJoystick={isTouchScreen} />
                    <ExitPlane handleExit={handleExit} />
                </Physics>
            </Canvas>
            <Overlay />
        </>
    ) : (
        <></>
    );
};
