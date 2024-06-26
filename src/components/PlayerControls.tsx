import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import React, { useEffect } from "react";
import { useControls, useIsTouchScreen } from "./Hooks";
import { PerspectiveCamera } from "@react-three/drei";
import { CAMERA_STARTING_POSITION, CAMERA_STARTING_ROTATION } from "./Constants";
import { useZeumStore } from "./ZeumStore";

export const PlayerControls = ({ startPosition, mainCameraRef }) => {
    const isTouchScreen = useIsTouchScreen();

    const { isContextActionActive, artifactPosition, setShowJoystick, isPlayerInRangeForContextAction, setIsContextActionActive } =
        useZeumStore();

    const { forward, backward, left, right, force } = useControls();

    const [playerRef, playerApi] = useBox(() => ({
        mass: 1,
        position: startPosition,
        fixedRotation: true,
        args: [2, 2, 2],
    }));

    let frontVector = new Vector3(0, 0, 0);
    let sideVector = new Vector3(0, 0, 0);
    let direction = new Vector3(0, 0, 0);

    useFrame(() => {
        if (isContextActionActive && !!artifactPosition.length) {
            setShowJoystick(false);
            playerApi.position.set(artifactPosition[0], artifactPosition[1], artifactPosition[2]);
            playerApi.velocity.set(0, 0, 0);
        } else {
            setShowJoystick(true);
        }

        // Lock controls when in close up mode
        if (isContextActionActive) return;

        const forwardForce = getCappedMovement(forward, force);
        const backwardForce = getCappedMovement(backward, force);
        const rightForce = getCappedMovement(right, force);
        const leftForce = getCappedMovement(left, force);

        frontVector.set(0, 0, forwardForce - backwardForce);
        sideVector.set(rightForce - leftForce, 0, 0);
        direction.subVectors(frontVector, sideVector);

        if (frontVector.length() !== 0 && sideVector.length() !== 0) {
            direction.normalize();
        }

        direction.multiplyScalar(30 * Math.sqrt(2));

        playerApi.velocity.set(direction.x, -15, direction.z);

        
    });

    return (
        <group 
// @ts-ignore
        ref={playerRef} api={playerApi} name="player-group">
            <PerspectiveCamera
                ref={mainCameraRef}
                makeDefault={!isContextActionActive}
                isPerspectiveCamera
                // @ts-ignore
                position={CAMERA_STARTING_POSITION}
                // @ts-ignore
                rotation={CAMERA_STARTING_ROTATION}
                fov={50}
            />

            <mesh receiveShadow castShadow>
                <PerspectiveCamera
                    makeDefault={isContextActionActive}
                    isPerspectiveCamera
                    position={[0, 4, isTouchScreen ? -15 : -6]}
                    rotation={[0, Math.PI, 0]}
                    fov={isTouchScreen ? 90 : 50}
                    zoom={isTouchScreen ? 2 : 1}
                />
                <meshStandardMaterial color="white" />
                <boxGeometry args={[2, 2, 2]} />
            </mesh>
        </group>
    );
};

function getCappedMovement(movement, force = 1) {
    return Math.min(movement * force, 1);
}
