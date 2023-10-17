// @ts-nocheck
import React, { useRef, useMemo, useCallback } from "react";
import { usePlane, useBox } from "@react-three/cannon";
import { TextureLoader, Vector3 } from "three";
import { Html, GradientTexture, PointsBuffer } from "@react-three/drei";
import { useThree, useFrame } from "@react-three/fiber";
import Particles from "react-particles";
import { loadSlim } from "tsparticles-slim";

export const MainFloor = ({ height, width }) => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], receiveShadow: true }), useRef(null));
    return (
        <mesh ref={ref} receiveShadow castShadow type="fixed">
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

export const Plane = (props) => {
    const [ref] = usePlane(() => ({ ...props }), useRef(null));
    return (
        <mesh ref={ref} receiveShadow castShadow type="fixed">
            <planeGeometry args={[50, 0, 0]} />
            <meshStandardMaterial color="white" />
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
                <meshStandardMaterial color="gray" />
            </mesh>
        </group>
    );
};

export const DisplayWall = (props) => {
    const artTexture = new TextureLoader().load(props?.artifact ?? <Html>Could not find an image</Html>);

    const [wallRef] = useBox(() => ({ ...props, type: "Static" }), useRef(null));
    const [frameRef] = useBox(
        () => ({ ...props, position: [props.position[0], props.position[1], props.position[2] - 0.2], type: "Static" }),
        useRef(null)
    );
    const [canvasRef] = useBox(
        () => ({ ...props, position: [props.position[0], props.position[1], props.position[2] - 0.5], type: "Static" }),
        useRef(null)
    );

    return (
        <group>
            <pointLight
                position={[props.position[0], props.position[1], props.position[2] - 5]}
                rotation={[-Math.PI / 2 + (25 * Math.PI) / 180, 0, 0]}
                color="white"
                intensity={25}
                castShadow
            />

            <mesh ref={wallRef} type="fixed" receiveShadow castShadow>
                <boxGeometry args={[props.width, props.height, props.depth]} />
                <meshStandardMaterial color="#6F7378" />
            </mesh>
            <mesh ref={frameRef} receiveShadow castShadow>
                <boxGeometry args={[props.width / 1.2, props.height / 1.45, props.depth]} />
                <meshStandardMaterial color="black" map={undefined} />
            </mesh>
            <mesh ref={canvasRef} receiveShadow castShadow>
                <boxGeometry args={[props.width / 1.25, props.height / 1.5, props.depth - 0.5]} />
                <meshStandardMaterial attach="material" map={artTexture} />
            </mesh>
        </group>
    );
};

export const Overlay = () => {
    const particlesInit = useCallback(async (engine) => {
        console.log(engine);
        // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
        // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
        // starting from v2 you can add only the features you need reducing the bundle size
        //await loadFull(engine);
        await loadSlim(engine);
    }, []);

    const particlesLoaded = useCallback(async (container) => {
        await console.log(container);
    }, []);

    return (
        <Particles
            id="tsparticles"
            init={particlesInit}
            loaded={particlesLoaded}
            options={{
                fpsLimit: 120,

                particles: {
                    color: {
                        value: "#ffffff",
                    },

                    move: {
                        direction: "bottom",
                        enable: true,

                        random: false,
                        speed: 0.8,
                        straight: false,
                    },
                    number: {
                        density: {
                            enable: true,
                            area: 1500,
                        },
                        value: 80,
                    },
                    opacity: {
                        value: 0.5,
                    },
                    shape: {
                        type: "circle",
                    },
                    size: {
                        value: { min: 0.1, max: 1 },
                    },
                },
                detectRetina: true,
            }}
        />
    );
};
