import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { str2Hex } from "../utils";
import { PlaneGeometry } from "three";
import { MeshBasicMaterial } from "three";

export default function Model(props) {
	const group = useRef();

	return (
		<group ref={group} {...props} dispose={null}>
			<mesh castShadow receiveShadow>
				<planeGeometry attach="geometry" args={[1000, 1000]} />
				<meshBasicMaterial attach="material" color="white" />
			</mesh>
		</group>
	);
}
