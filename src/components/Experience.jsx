import { Cylinder } from "@react-three/drei";
import { RigidBody, CylinderCollider } from "@react-three/rapier";
import { StickControls } from "./StickControls";
import { useMemo } from "react";

export const Experience = () => {
	const isTouchScreen = useMemo(() => {
		return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
	}, []);
	return (
		<>
			<ambientLight intensity={1} />
			<directionalLight poisition={[5, 5, 5]} intensity={0.8} castShadow color="#9e69da" />
			<RigidBody colliders={false} type="fixed" position-y={-0.5} friction={10}>
				<CylinderCollider args={[1, 21]}>
					<Cylinder scale={[22, 2, 22]} receiveShadow>
						<meshStandardMaterial color="gray" />
					</Cylinder>
				</CylinderCollider>
			</RigidBody>
			<StickControls
				camProps={{
					makeDefault: true,
					fov: 80,
					position: [0, 2.75, 8],
				}}
				orbitProps={{
					target: [0, 2.75, 0],
				}}
				enableJoystick={isTouchScreen}
				enableKeyboard
			/>
		</>
	);
};
