/**
 * Based on https://codepen.io/ogames/pen/rNmYpdo
 * - refactored to use fiber + drei semantics and compatible with @react-three/fiber
 * - added keyboard listener
 * - adjustment for fps
 */

import { OrbitControls, PerspectiveCamera, Box } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useRef } from "react";
import { Vector3 } from "three";
import nipplejs from "nipplejs";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import * as THREE from "three";
let fwdValue = 0;
let bkdValue = 0;
let rgtValue = 0;
let lftValue = 0;
let joyManager;
const tempVector = new Vector3();
const upVector = new Vector3(0, 1, 0);

const NIPPLEJS_OPTIONS = {
	zone: document.getElementById("joystickWrapper1"),
	size: 120,
	multitouch: true,
	maxNumberOfNipples: 2,
	mode: "static",
	restJoystick: true,
	shape: "circle",
	position: { top: "60px", left: "60px" },
	dynamicPage: true,
};

const handleMove = (evt, data) => {
	const forward = data.vector.y;
	const turn = data.vector.x;

	if (forward > 0) {
		fwdValue = Math.abs(forward);
		bkdValue = 0;
	} else if (forward < 0) {
		fwdValue = 0;
		bkdValue = Math.abs(forward);
	}

	if (turn > 0) {
		lftValue = 0;
		rgtValue = Math.abs(turn);
	} else if (turn < 0) {
		lftValue = Math.abs(turn);
		rgtValue = 0;
	}
};

function useKeyboard({ enableKeyboard }) {
	const onKeyDown = (event) => {
		switch (event.code) {
			case "ArrowUp":
			case "KeyW":
				handleMove({}, { vector: { y: 1 } });
				break;

			case "ArrowLeft":
			case "KeyA":
				handleMove({}, { vector: { x: -1 } });
				break;

			case "ArrowDown":
			case "KeyS":
				handleMove({}, { vector: { y: -1 } });
				break;

			case "ArrowRight":
			case "KeyD":
				handleMove({}, { vector: { x: 1 } });
				break;
			default:
				break;
		}
	};

	const onKeyUp = (event) => {
		switch (event.code) {
			case "ArrowUp":
			case "KeyW":
				fwdValue = 0;
				break;

			case "ArrowLeft":
			case "KeyA":
				lftValue = 0;
				break;

			case "ArrowDown":
			case "KeyS":
				bkdValue = 0;
				break;

			case "ArrowRight":
			case "KeyD":
				rgtValue = 0;
				break;
			default:
				break;
		}
	};

	useEffect(() => {
		if (enableKeyboard) {
			document.addEventListener("keydown", onKeyDown);
			document.addEventListener("keyup", onKeyUp);
		}

		return () => {
			document.removeEventListener("keydown", onKeyDown);
			document.removeEventListener("keyup", onKeyUp);
		};
	}, [enableKeyboard]);
}

function useJoystick({ enableJoystick }) {
	const handleEnd = () => {
		bkdValue = 0;
		fwdValue = 0;
		lftValue = 0;
		rgtValue = 0;
	};

	useEffect(() => {
		if (!joyManager && enableJoystick) {
			joyManager = nipplejs.create(NIPPLEJS_OPTIONS);
			joyManager["0"].on("move", handleMove);
			joyManager["0"].on("end", handleEnd);
		}

		return () => {
			if (joyManager) {
				joyManager["0"].off("move", handleMove);
				joyManager["0"].off("end", handleEnd);
			}
		};
	}, [enableJoystick]);
}
const MOVEMENT_SPEED = 5;
const MAX_VEL = 5;
export const StickControls = ({
	enableJoystick,
	enableKeyboard,
	orbitProps = {},
	camProps = {},
	mult = 1.2,
}) => {
	const orbitRef = useRef();
	const camRef = useRef();
	const characterRef = useRef({ position: [0, 1, 0] });

	const updatePlayer = useCallback((state) => {
		//const controls = orbitRef.current;
		const impulse = { x: 0, y: 0, z: 0 };
		//const angle = controls.getAzimuthalAngle();
		const linvel = characterRef.current?.linvel?.();

		let dirX = 0;
		let dirZ = 0;

		if (lftValue) {
			dirX += 1;
		}
		if (rgtValue) {
			dirX -= 1;
		}
		if (fwdValue) {
			dirZ += 1;
		}
		if (bkdValue) {
			dirZ -= 1;
		}
		console.log(state.clock.getDelta());
		let force = MOVEMENT_SPEED * (state.clock.getDelta() * 2048);
		if ((lftValue || rgtValue) && (fwdValue || bkdValue)) {
			force /= Math.sqrt(2); // Halve the force when moving diagonally
		}

		// Apply the force to the corresponding components of impulse
		impulse.x += dirX * force;
		impulse.z += dirZ * force;

		// Limit the magnitude of impulse
		const currentSpeed = Math.sqrt(linvel.x ** 2 + linvel.z ** 2);

		if (currentSpeed > MAX_VEL) {
			impulse.x *= MAX_VEL / currentSpeed;
			impulse.z *= MAX_VEL / currentSpeed;
		}

		characterRef.current.applyImpulse(impulse, true);

		const boxPosition = new THREE.Vector3(
			characterRef.current.translation().x,
			characterRef.current.translation().y,
			characterRef.current.translation().z
		);
		const cameraOffset = new THREE.Vector3(0, 1, -2.5);
		const cameraPosition = boxPosition.clone().add(cameraOffset);
		camRef.current.position.copy(cameraPosition);

		orbitRef.current.target.copy(boxPosition);
		orbitRef.current.update();
		camRef.current.lookAt(boxPosition);
	}, []);

	useFrame((state) => {
		updatePlayer(state);
	});

	useJoystick({ enableJoystick });
	useKeyboard({ enableKeyboard });

	return (
		<>
			<OrbitControls
				autoRotate={false}
				enableDamping={false}
				enableZoom={true}
				enablePan={false}
				autoRotateSpeed={0}
				rotateSpeed={0.4}
				dampingFactor={0.1}
				{...orbitProps}
				ref={orbitRef}
			/>
			<PerspectiveCamera {...camProps} ref={camRef} />
			<RigidBody
				ref={characterRef}
				scale={[0.5, 0.5, 0.5]}
				enabledRotations={[false, false, false]}
			>
				<CuboidCollider args={[0.5, 0.5, 0.5, 0.5]} />

				<Box scale={[2, 2, 2]}></Box>
			</RigidBody>
		</>
	);
};
