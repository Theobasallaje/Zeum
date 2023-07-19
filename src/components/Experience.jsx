import { Cylinder } from "@react-three/drei";
import { RigidBody, CylinderCollider } from "@react-three/rapier";
import { CharacterController } from "./CharacterController";

export const Experience = () => {
	return (
		<>
			<ambientLight intensity={1} />
			<directionalLight poisition={[5, 5, 5]} intensity={0.8} castShadow color="#9e69da" />
			<RigidBody colliders={false} type="fixed" position-y={-0.5} friction={10}>
				<CylinderCollider args={[1, 21]}>
					<Cylinder scale={[20, 2, 20]} receiveShadow>
						<meshStandardMaterial color="gray" />
					</Cylinder>
				</CylinderCollider>
			</RigidBody>

			<CharacterController position={[0, 1, 0]} />
		</>
	);
};
