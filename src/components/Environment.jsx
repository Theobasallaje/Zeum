// @ts-nocheck
import { usePlane, useBox } from "@react-three/cannon";
import { GradientTexture, Html } from "@react-three/drei";
import { useZeumStore } from "./ZeumStore";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useCallback, useEffect, useReducer } from "react";
import { Object3D } from "three";

export const MainFloor = ({ height, width }) => {
    const [ref] = usePlane(
        () => ({ position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true }),
        useRef(null)
    );
    return (
        <mesh ref={ref} position={[0, 0, 0]} receiveShadow castShadow type="fixed">
            <planeGeometry args={[width, height]} />
            <meshStandardMaterial>
                <GradientTexture
                    stops={[0, 0.1, 0.2, 0.22, 0.26, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
                    colors={[
                        "white",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                    ]}
                />
            </meshStandardMaterial>
        </mesh>
    );
};

export const ExitPlane = ({ roomHeight, handleExit }) => {
    const [ref] = useBox(
        () => ({
            args: [roomHeight, 0, 0],
            rotation: [-Math.PI / 2, 0, 0],
            position: [0, 0, -(roomHeight / 2 - 0.5)],
            receiveShadow: true,
            onCollide: handleExit,
        }),
        useRef(null)
    );

    return <mesh ref={ref} type="fixed" name="exit-plane"></mesh>;
};

export const Wall = (props) => {
    const [wallRef] = useBox(() => ({ ...props, type: "Static" }), useRef(null));
    return (
        <group>
            <mesh ref={wallRef} type="fixed" receiveShadow castShadow>
                <boxGeometry args={[props.width, props.height, props.depth]} />
                <meshStandardMaterial color="#787878" />
            </mesh>
        </group>
    );
};

export const CeilingPlane = () => {
    const [ref] = usePlane(
        () => ({ rotation: [-Math.PI / 2, 0, 0], position: [0, 10, 0], receiveShadow: true }),
        useRef(null)
    );
    return (
        <mesh ref={ref} receiveShadow castShadow type="fixed">
            <planeGeometry args={[50, 50, 0]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
};

export const DisplayWall = ({ artifact, args, position, width, height, depth }) => {
    const artifactRef = useRef(artifact);
    const [, forceUpdate] = useReducer((x) => x + 1, 0);

    const [wallRef] = useBox(() => ({ position, args, width, height, depth, type: "Static" }), useRef(null));
    const [contextActionRangeRef] = useBox(
        () => ({
            args: [width, height, depth + 10],
            type: "Static",
            rotation: [-Math.PI / 2, 0, 0],
            collisionResponse: false,
            position: [position[0], 1, position[2] - 6],
            onCollide: handlePlayerClose,
            onCollideEnd: handlePlayerFar,
        }),
        useRef(null)
    );
    const { setIsPlayerInRangeForContextAction, deactivateCloseUp, setArtifactPosition } = useZeumStore();
    const handlePlayerClose = useCallback(
        (e) => {
            setIsPlayerInRangeForContextAction(true);

            const viewingPosition = [position[0], 1, position[2] - 8];
            setArtifactPosition(viewingPosition);
        },
        [position, setArtifactPosition, setIsPlayerInRangeForContextAction]
    );

    const handlePlayerFar = useCallback(() => {
        deactivateCloseUp();
    }, [deactivateCloseUp]);

    useEffect(() => {
        //This is not ideal but needed to ensure correct aspect ratio on first frame
        forceUpdate();
    });

    return (
        <group>
            <pointLight
                position={[position[0], position[1], position[2] - 5]}
                rotation={[-Math.PI / 2 + (25 * Math.PI) / 180, 0, 0]}
                color="white"
                intensity={25}
                castShadow
            />
            <mesh ref={contextActionRangeRef}></mesh>
            <mesh ref={wallRef} type="fixed" receiveShadow castShadow>
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color="#6F7378" />
            </mesh>
            <Html
                position={[position[0], position[1], position[2] - 0.3]}
                transform
                occlude="blending"
                distanceFactor={0}
                style={{ backgroundColor: "#63686e" }}
            >
                <img
                    src={artifactRef?.current}
                    alt="Art Display"
                    style={{
                        height: "25vh",
                        border: "3px solid #2a2a2a",
                    }}
                />
            </Html>
        </group>
    );
};

export const Dust = () => {
    const count = 1500;
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100;
            const factor = Math.random() * 50 + 20;
            const speed = Math.random() * 0.0009;
            const x = Math.random() * 100 - 50;
            const y = Math.random() * 200 - 100;
            const z = Math.random() * 100 - 50;

            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new Object3D(), []);

    useFrame(() => {
        particles.forEach((particle, index) => {
            let { factor, speed, x, y, z } = particle;

            // Update the particle time
            const t = (particle.time += speed);

            // Calculate the falling effect by reducing the y position over time
            y -= speed;

            // Update the particle position based on the time and falling effect
            dummy.position.set(
                x + Math.cos((t / 10) * factor),
                y + Math.sin((t / 5) * factor),
                z + Math.sin((t / 10) * factor)
            );

            dummy.updateMatrix();

            // Apply the matrix to the instanced item
            mesh.current.setMatrixAt(index, dummy.matrix);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]} receiveShadow castShadow>
            <dodecahedronGeometry args={[0.025, 0]} />
            <meshPhongMaterial color="#ffffff" />
        </instancedMesh>
    );
};
