import { Box, PerspectiveCamera, useKeyboardControls } from "@react-three/drei";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import { Controls } from "../App";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const MOVEMENT_SPEED = 0.5;
const MAX_VEL = 3;

export const CharacterController = ({ position }) => {
	const character = useRef({ position });
	//const jumpPressed = useKeyboardControls((state) => state[Controls.jump]);
	//const leftPressed = useKeyboardControls((state) => state[Controls.left]);
	//const rightPressed = useKeyboardControls((state) => state[Controls.right]);
	//const backPressed = useKeyboardControls((state) => state[Controls.back]);
	//const forwardPressed = useKeyboardControls((state) => state[Controls.forward]);

	//useFrame(() => {
	//	if (character.current) {
	//		const impulse = { x: 0, y: 0, z: 0 };
	//
	//		//if (jumpPressed) {
	//		//	impulse.y += JUMP_FORCE;
	//		//}
	//
	//		const linvel = character.current?.linvel?.();
	//
	//		if (rightPressed && linvel?.x < MAX_VEL) {
	//			impulse.x += MOVEMENT_SPEED;
	//		}
	//
	//		if (leftPressed && linvel?.x > -MAX_VEL) {
	//			impulse.x -= MOVEMENT_SPEED;
	//		}
	//
	//		if (backPressed && linvel?.z < MAX_VEL) {
	//			impulse.z += MOVEMENT_SPEED;
	//		}
	//
	//		if (forwardPressed && linvel?.z > -MAX_VEL) {
	//			impulse.z -= MOVEMENT_SPEED;
	//		}
	//
	//		character.current.applyImpulse(impulse, true);
	//	}
	//});

	return (
		<group>
			<RigidBody
				ref={character}
				position={new Vector3(0, 0, 0)}
				colliders={false}
				scale={[0.5, 0.5, 0.5]}
				enabledRotations={[false, false, false]}
			>
				<PerspectiveCamera position={[0, 3, 10]} makeDefault />
				<CuboidCollider args={[0.5, 0.5, 0.5, 0.5]} />
				<Box scale={[1, 1, 1]}></Box>
			</RigidBody>
		</group>
	);
};
