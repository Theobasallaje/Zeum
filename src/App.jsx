import { Canvas } from "@react-three/fiber";
import { Physics, usePlane, useBox } from "@react-three/cannon";
import { PlayerControls } from "../src/components/PlayerControls";
import { useRef, useMemo } from "react";
import { TextureLoader } from "three";

export const App = () => {
    const isTouchScreen = useMemo(() => {
        return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
    }, []);

    const Plane = (props) => {
        const [ref] = usePlane(() => ({ ...props }), useRef(null));
        return (
            <mesh ref={ref} receiveShadow castShadow>
                <planeGeometry args={[50, 50]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        );
    };

    const Wall = (props) => {
        const [ref] = useBox(() => ({ ...props }), useRef(null));
        return (
            <mesh ref={ref} receiveShadow castShadow>
                <boxGeometry args={[props.width, props.height, props.depth]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        );
    };

    const DisplayWall = (props) => {
        const artTexture = new TextureLoader().load(
            "https://cdn.nostr.build/i/6c44053c67153a367055f5366737e51f6c5773acef636ba34cf48d53a9712a12.jpg"
        );
        const frameTexture = new TextureLoader().load("https://wallpapercave.com/wp/wp3637943.jpg");
        const [wallRef] = useBox(() => ({ ...props, type: "Static" }), useRef(null));
        const [canvasRef] = useBox(() => ({ ...props, type: "Static" }), useRef(null));
        const [frameRef] = useBox(() => ({ ...props, type: "Static" }), useRef(null));

        return (
            <group>
                <mesh ref={wallRef} type="fixed" receiveShadow castShadow>
                    <boxGeometry args={[props.width, props.height, props.depth]} />
                    <meshStandardMaterial color="#6F7378" />
                </mesh>
                <mesh ref={frameRef} receiveShadow castShadow>
                    <boxGeometry args={[props.width / 1.2, props.height / 1.45, props.depth]} />
                    <meshStandardMaterial attach="material" map={frameTexture} />
                </mesh>
                <mesh ref={canvasRef} receiveShadow castShadow>
                    <boxGeometry args={[props.width / 1.25, props.height / 1.5, props.depth]} />
                    <meshStandardMaterial attach="material" map={artTexture} />
                </mesh>
            </group>
        );
    };

    return (
        <Canvas
            camera={{ far: 100, near: 1, position: [0, 10, -10], zoom: 100 }}
            orthographic
            shadows
            gl={{
                // todo: stop using legacy lights
                useLegacyLights: true,
            }}
        >
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, 4]} color="white" intensity={0.8} />

            <Physics iterations={15} gravity={[0, -15, 0]} allowSleep={false}>
                <Plane rotation={[-Math.PI / 2, 0, 0]} receiveShadow />
                <Wall position={[0, 5, 25]} width={50} height={12.5} depth={0.5} />
                <DisplayWall args={[5, 5, 0.5]} position={[0, 2.5, 10]} width={5} height={5} depth={0.5} />
                <PlayerControls showJoystick={isTouchScreen} />
            </Physics>
        </Canvas>
    );
};
