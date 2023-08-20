import { Cylinder, Box, Html, Plane } from "@react-three/drei";
import { RigidBody, CylinderCollider, CuboidCollider } from "@react-three/rapier";
import { StickControls } from "./StickControls";
import { useMemo, useEffect } from "react";
import { TextureLoader } from "three";
import { relayInit, generatePrivateKey, getPublicKey, getEventHash, getSignature } from "nostr-tools";

export const Experience = () => {
    const isTouchScreen = useMemo(() => {
        return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
    }, []);

    //const relay = relayInit("wss://relay.example.com");
    //relay.on("connect", () => {
    //    console.log(`connected to ${relay.url}`);
    //});
    //relay.on("error", () => {
    //    console.log(`failed to connect to ${relay.url}`);
    //});
    //useEffect(() => {
    //    relay.connect();
    //}, [relay]);

    const texture = new TextureLoader().load(
        "https://cdn.nostr.build/i/6c44053c67153a367055f5366737e51f6c5773acef636ba34cf48d53a9712a12.jpg"
    );
    return (
        <>
            <ambientLight intensity={0.5} castShadow />
            <directionalLight poisition={[0, 5, 50]} angle={Math.PI / 2} intensity={1} castShadow color="white" />
            {/*<spotLight position={[0, 10, 50]} angle={Math.PI / 2} penumbra={0.8} intensity={1} castShadow color="white" />*/}

            <RigidBody colliders={false} type="fixed" position-y={-0.5} friction={10}>
                <CuboidCollider args={[50, 1, 50]}>
                    <Box scale={[50, 1, 50]} receiveShadow>
                        <meshStandardMaterial color="gray" />
                    </Box>
                </CuboidCollider>
            </RigidBody>

            <RigidBody type="fixed" friction={10}>
                <Box position={[0, 1.5, 5.2]} args={[5, 3, 0.1]} castShadow>
                    <meshStandardMaterial color="#808080" />
                    <CuboidCollider args={[4, 2, 0.1]} />
                </Box>
                <Plane position={[0, 1.5, 5.1]} rotation={[Math.PI, 0, Math.PI]} args={[3.35, 1.75]}>
                    <meshStandardMaterial color="black" />
                </Plane>
                <Plane position={[0, 1.5, 5]} rotation={[Math.PI, 0, Math.PI]} args={[3, 1.5]} receiveShadow castShadow>
                    <meshStandardMaterial attach="material" map={texture} />
                </Plane>
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
