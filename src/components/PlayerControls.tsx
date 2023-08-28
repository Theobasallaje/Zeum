import { useBox } from "@react-three/cannon";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import React from "react";
import { usePersonControls } from "./hooks";

export const PlayerControls = () => {
    const { forward, backward, left, right, jump } = usePersonControls();

    const [boxRef, api] = useBox(() => ({
        mass: 10,
        position: [0, 1, 0],
        type: "Dynamic",
    }));
    useFrame(() => {
        // Calculating front/side movement ...
        let frontVector = new Vector3(0, 0, 0);
        let sideVector = new Vector3(0, 0, 0);
        let direction = new Vector3(0, 0, 0);

        frontVector.set(0, 0, Number(forward) - Number(backward));
        sideVector.set(Number(right) - Number(left), 0, 0);
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(6);

        api.velocity.set(direction.x, 0, direction.z);
    });

    return <boxBufferGeometry ref={boxRef} />;
};
