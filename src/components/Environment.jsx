import { useRef } from "react";
import { usePlane, useBox } from "@react-three/cannon";
import { TextureLoader } from "three";

export const Plane = (props) => {
    const [ref] = usePlane(() => ({ ...props }), useRef(null));
    return (
        <mesh ref={ref} receiveShadow castShadow>
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
};

export const Wall = (props) => {
    const [ref] = useBox(() => ({ ...props }), useRef(null));
    return (
        <mesh ref={ref} receiveShadow castShadow>
            <boxGeometry args={[props.width, props.height, props.depth]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
};

export const DisplayWall = (props) => {
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
