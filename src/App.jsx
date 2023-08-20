import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { Suspense, useMemo } from "react";
import { Physics } from "@react-three/rapier";
import { KeyboardControls, controls } from "@react-three/drei";
import { FPSControls } from "react-three-fpscontrols";
import { StickControls } from "./components/StickControls";

export const Controls = {
    forward: "forward",
    back: "back",
    left: "left",
    right: "right",
    jump: "jump",
};

function App() {
    return (
        <Canvas shadows colorManagement>
            <color attach="background" args={["#404040"]} />
            <Suspense fallback>
                <Physics>
                    <Experience />
                </Physics>
            </Suspense>
        </Canvas>
    );
}

export default App;
