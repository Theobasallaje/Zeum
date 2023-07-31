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
	const controlsMap = useMemo(
		() => [
			{ name: Controls.forward, keys: ["ArrowUp", "KeyW"] },
			{ name: Controls.back, keys: ["ArrowDown", "KeyS"] },
			{ name: Controls.left, keys: ["ArrowLeft", "KeyA"] },
			{ name: Controls.right, keys: ["ArrowRight", "KeyD"] },
			{ name: Controls.jump, keys: ["Space"] },
		],
		[]
	);

	return (
		<Canvas shadows>
			<color attach="background" args={["#ececec"]} />
			<Suspense fallback>
				<Physics>
					<Experience />
				</Physics>
			</Suspense>
		</Canvas>
	);
}

export default App;
