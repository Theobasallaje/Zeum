// @ts-nocheck
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import React, { useEffect, useRef } from "react";
import { useControls, useIsTouchScreen, usePlayerPosition } from "./Hooks";
import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { CAMERA_STARTING_POSITION, CAMERA_STARTING_ROTATION } from "./Constants";
import { useZeumStore } from "./ZeumStore";

export const PlayerControls = ({ startPosition, mainCameraRef }) => {
    const isTouchScreen = useIsTouchScreen();
    const { isContextActionActive, isPlayerInRangeForContextAction, setPlayerClosePosition, artifactPosition } =
        useZeumStore();

    const { forward, backward, left, right, force } = useControls();
    const [playerRef, playerApi] = useBox(() => ({
        mass: 1,
        position: startPosition,
        fixedRotation: true,
        args: [2, 2, 2],
    }));

    useFrame(() => {
        // Lock controls when in close up mode
        if (isContextActionActive) return;

        let frontVector = new Vector3(0, 0, 0);
        let sideVector = new Vector3(0, 0, 0);
        let direction = new Vector3(0, 0, 0);
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

    useEffect(() => {
        if (isContextActionActive && !!artifactPosition.length) {
            document.getElementById("joystickWrapper1").style.display = "none";
            playerApi.position.set(artifactPosition[0], artifactPosition[1], artifactPosition[2]);
        } else {
            document.getElementById("joystickWrapper1").style.display = "block";
        }
    }, [
        artifactPosition,
        isContextActionActive,
        isPlayerInRangeForContextAction,
        playerApi.position,
        setPlayerClosePosition,
    ]);

    return (
        <group ref={playerRef} api={playerApi} name="player-group">
            <PerspectiveCamera
                ref={mainCameraRef}
                makeDefault={!isContextActionActive}
                isPerspectiveCamera
                position={CAMERA_STARTING_POSITION}
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

function getCappedMovement(movement, force = 1, cap = 1) {
    return Math.min(movement * force, cap);
}
