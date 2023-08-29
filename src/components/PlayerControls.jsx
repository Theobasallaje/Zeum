import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import React, { useRef } from "react";
import { usePersonControls } from "./Hooks";
import { PerspectiveCamera } from "@react-three/drei";

export const PlayerControls = ({ showJoystick }) => {
    const cameraRef = useRef();
    const { forward, backward, left, right } = usePersonControls({ showJoystick });

    const [ref, api] = useBox(() => ({
        mass: 10,
        position: [0, -4, -10],
        type: "Dynamic",
        fixedRotation: true,
    }));

    useFrame(() => {
        let frontVector = new Vector3(0, 0, 0);
        let sideVector = new Vector3(0, 0, 0);
        let direction = new Vector3(0, 0, 0);

        frontVector.set(0, 0, Number(forward) - Number(backward));
        sideVector.set(Number(right) - Number(left), 0, 0);
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(30);
        api.velocity.set(direction.x, 0, direction.z);
    });

    return (
        <group ref={ref} api={api}>
            <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 1, -5]} rotation={[0, Math.PI, 0]} />

            <mesh receiveShadow castShadow>
                <meshStandardMaterial color="white" />
                <boxGeometry args={[1, 1, 1]} />
            </mesh>
        </group>
    );
};
