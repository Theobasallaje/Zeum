import { useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { Plane, Wall, DisplayWall } from "./components/Environment";
import { PlayerControls } from "./components/PlayerControls";

export const App = () => {
    const isTouchScreen = useMemo(() => {
        return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
    }, []);

    return (
        <Canvas
            camera={{ far: 100, near: 1, position: [0, 10, -10], zoom: 50 }}
            orthographic
            shadows
            gl={{
                // todo: stop using legacy lights
                useLegacyLights: true,
            }}
        >
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 5, 4]} color="white" intensity={0.8} />

            <Physics iterations={15} gravity={[0, -15, 0]}>
                <Plane rotation={[-Math.PI / 2, 0, 0]} receiveShadow />
                <Wall position={[0, 5, 25]} args={[50, 25, 0.5]} width={50} height={10} depth={0.5} />
                <DisplayWall args={[5, 5, 0.5]} position={[0, 2.5, 10]} width={5} height={5} depth={0.5} />

                <PlayerControls showJoystick={isTouchScreen} />
            </Physics>
        </Canvas>
    );
};
