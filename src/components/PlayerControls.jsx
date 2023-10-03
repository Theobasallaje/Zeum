// @ts-nocheck
import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import React, { useRef } from "react";
import { useControls } from "./Hooks";
import { PerspectiveCamera } from "@react-three/drei";

export const PlayerControls = ({ showJoystick }) => {
    const cameraRef = useRef();
    const { forward, backward, left, right, force } = useControls({ showJoystick });
    const [playerRef, playerApi] = useBox(() => ({
        mass: 50,
        position: [0, 0, -10],
        fixedRotation: true,
        args: [2, 2, 2],
    }));

    useFrame(() => {
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

    return (
        <group ref={playerRef} api={playerApi} name="player-group">
            {/* <OrbitControls ref={cameraRef} /> */}
            <PerspectiveCamera
                ref={cameraRef}
                makeDefault
                isPerspectiveCamera
                position={[5.6, 16.5, -27]}
                rotation={[-2.7, 0.13, 3.07]}
            />

            <mesh receiveShadow castShadow>
                <meshStandardMaterial color="white" />
                <boxGeometry args={[2, 2, 2]} />
            </mesh>
        </group>
    );
};

function getCappedMovement(movement, force = 1, cap = 1) {
    return Math.min(movement * force, cap);
}
