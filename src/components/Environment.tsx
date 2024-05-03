// @ts-nocheck
import { usePlane, useBox } from "@react-three/cannon";
import { GradientTexture, Html } from "@react-three/drei";
import { useZeumStore } from "./ZeumStore";
import { useFrame } from "@react-three/fiber";
import React, { useRef, useMemo, useCallback, useEffect, useReducer } from "react";
import { Object3D } from "three";

export const Floor = ({ depth, width, position, debug = false }) => {
    const [ref] = useBox(
        () => ({ position, rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, collisionResponse: false }),
        useRef(null)
    );
    return (
        <mesh ref={ref} position={position} receiveShadow castShadow type="fixed">
            <planeGeometry args={[width, depth]} />
            <meshStandardMaterial color={debug ? "red" : "gray"} />
        </mesh>
    );
};

export const MainFloor = ({ height, width }) => {
    const [ref] = usePlane(
        () => ({ position: [0, 0, 0], rotation: [-Math.PI / 2, 0, 0], receiveShadow: true, type: "Static" }),
        useRef(null)
    );
    return (
        <mesh ref={ref} position={[0, 0, 0]} receiveShadow castShadow>
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
            // receiveShadow: true,
            onCollide: handleExit,
        }),
        useRef(null)
    );

    return <mesh ref={ref} type="static" name="exit-plane"></mesh>;
};

export const Wall = ({ position, horizontal = false, height, width, depth, visible = true }) => {
    const [wallRef] = useBox(
        () => ({
            position,
            height,
            rotation: horizontal ? [0, Math.PI / 2, 0] : [0, 0, 0],
            width,
            depth,
            type: "Static",
            args: [width, height, depth],
        }),
        useRef(null)
    );
    return (
        <mesh ref={wallRef}  receiveShadow castShadow>
            <boxGeometry args={[width, height, depth]} />
            <meshStandardMaterial color="#787878" visible={visible ?? true} />
        </mesh>
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

export const DisplayWall = ({ artifact, position, width=10, height=8, depth=0.5 }) => {
    const artifactRef = useRef(artifact);
    const { setIsPlayerInRangeForContextAction, deactivateCloseUp, setArtifactPosition } = useZeumStore();

    const handlePlayerClose = useCallback(
        () => {
            setIsPlayerInRangeForContextAction(true);
            setArtifactPosition([position[0], 1, position[2] - 8]);
        },
        [position]
    );

    const handlePlayerFar = useCallback(() => {
        deactivateCloseUp();
    }, [deactivateCloseUp]);

    const [wallRef] = useBox(() => ({ position, width, height, depth, type: "Static", args: [width, height, depth], }), useRef(null));

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

    return (
        <group>
            <pointLight
                position={[position[0], position[1], position[2] - 5]}
                color="white"
                intensity={15} 
                castShadow
                shadow-mapSize-width={512} 
                shadow-mapSize-height={512}
            />
            <mesh ref={contextActionRangeRef}></mesh>
            <mesh ref={wallRef} >
                <boxGeometry args={[width, height, depth]} />
                <meshStandardMaterial color="#6F7378" />
            </mesh>
            <Html
                position={[position[0], position[1], position[2] - 0.3]}
                transform
                occlude="blending"
                distanceFactor={0}
                style={{ backgroundColor: "#6f747c", transform: "scaleX(-1)" }}
            >
                <img
                    src={artifactRef?.current || artifact}
                    alt="Art Display"
                    style={{
                        height: "22vh",
                        border: "2px solid #2a2a2a",
                    }}
                />
            </Html>
        </group>
    );
};

export const Dust = () => {
    const count = 800;
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100;
            const factor = Math.random() * 50;
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
        <instancedMesh ref={mesh} args={[null, null, count]} >
            <dodecahedronGeometry args={[0.025, 0]} />
            <meshPhongMaterial color="#ffffff" />
        </instancedMesh>
    );
};

export const FullSizeRoom = ({ roomDepth, roomWidth }) => {
    return (
        <>
            {/* 1st Room Back Wall */}
            <Wall position={[0, 7.5, 62.5]} horizontal width={2} height={15} depth={50} />
            {/* Left Wall */}
            <Wall position={[24, 2.5, 0]} width={2} height={5} depth={roomDepth} />
            {/* Inner Left Wall */}
            <Wall position={[-26, 2.5, 0]} width={2} height={5} depth={50} />
            {/* Inner Right Wall */}
            <Wall position={[-75, 2.5, 0]} width={2} height={5} depth={50} />
            {/* Right Wall */}

            <Wall position={[-124, 2.5, 0]} width={2} height={5} depth={roomDepth} />
            <Wall position={[-50.5, 2.5, 24]} horizontal width={2} height={5} depth={51} visible={false} />
            <Wall position={[-50.5, 2.5, -24]} horizontal width={2} height={5} depth={51} />
            <Wall position={[-50.5, 2.5, -62]} horizontal width={2} height={5} depth={51} visible={false} />
            <Floor position={[-50, 0, -42.75]} width={roomWidth} depth={roomDepth / 3 - 2} />

            {/* Hallway Back Wall */}
            <Wall position={[-50, 7.5, 62.5]} horizontal width={2} height={15} depth={50} />
            {/* Hallway Floor */}
            <Floor position={[-50, 0, 43.5]} width={roomWidth} depth={roomDepth / 3 - 2} />
            {/* 2nd Room Back Wall */}
            <Wall position={[-100, 7.5, 62.5]} horizontal width={2} height={15} depth={50} />
            {/* 2nd Room Floor */}
            <Floor position={[-100, 0, 0]} width={roomWidth} depth={roomDepth} />
            {/* 2nd Room Front Wall */}
            <Wall position={[-100, 2.5, -62]} horizontal width={2} height={5} depth={50} visible={false} />
            <MainFloor height={roomDepth} width={roomWidth} />
        </>
    );
};
