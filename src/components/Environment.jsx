import { useRef } from "react";
import { usePlane, useBox } from "@react-three/cannon";
import { TextureLoader } from "three";
import { Html } from "@react-three/drei";

export const Plane = (props) => {
    const [ref] = usePlane(() => ({ ...props }), useRef(null));
    return (
        <mesh ref={ref} receiveShadow castShadow type="fixed">
            <planeGeometry args={[50, 50]} />
            <meshStandardMaterial color="gray" />
        </mesh>
    );
};

export const Wall = (props) => {
    const [wallRef] = useBox(() => ({ ...props, type: "Static" }), useRef(null));
    return (
        <group>
            <mesh ref={wallRef} type="fixed" receiveShadow castShadow>
                <boxGeometry args={[props.width, props.height, props.depth]} />
                <meshStandardMaterial color="gray" />
            </mesh>
        </group>
    );
};

export const DisplayWall = (props) => {
    const artTexture = new TextureLoader().load(props?.image ?? <Html>Could not find an image</Html>);
    //const frameTexture = new TextureLoader().load("https://wallpapercave.com/wp/wp3637943.jpg");
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
                <meshStandardMaterial color="black" map={undefined} />
            </mesh>
            <mesh ref={canvasRef} receiveShadow castShadow>
                <boxGeometry args={[props.width / 1.25, props.height / 1.5, props.depth]} />
                <meshStandardMaterial attach="material" map={artTexture} />
            </mesh>
        </group>
    );
};
