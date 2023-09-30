import { useRef, useMemo } from "react";
import { usePlane, useBox } from "@react-three/cannon";
import { TextureLoader, Vector3 } from "three";
import { Html, GradientTexture } from "@react-three/drei";
import { useThree } from "@react-three/fiber";

export const MainFloor = () => {
    const [ref] = usePlane(() => ({ rotation: [-Math.PI / 2, 0, 0], receiveShadow: true }), useRef(null));

    return (
        <mesh ref={ref} receiveShadow castShadow type="fixed">
            <planeGeometry args={[50, 50, 5]} />
            <meshStandardMaterial>
                <GradientTexture
                    stops={[0, 0.1, 0.2, 0.22, 0.26, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1]}
                    colors={[
                        "white",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                        "gray",
                    ]}
                />
            </meshStandardMaterial>
        </mesh>
    );
};

export const Plane = (props) => {
    const [ref] = usePlane(() => ({ ...props }), useRef(null));
    return (
        <mesh ref={ref} receiveShadow castShadow type="fixed">
            <planeGeometry args={[50, 0, 0]} />
            <meshStandardMaterial color="white" />
        </mesh>
    );
};

export const ExitPlane = ({ handleExit }) => {
    const [ref] = useBox(
        () => ({
            args: [50, 0, 0],
            rotation: [-Math.PI / 2, 0, 0],
            position: [0, 0, -25],
            receiveShadow: true,
            onCollide: handleExit,
        }),
        useRef(null)
    );

    return <mesh ref={ref} type="fixed" name="exit-plane"></mesh>;
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
    const [wallRef] = useBox(() => ({ ...props, type: "Static" }), useRef(null));
    const [frameRef] = useBox(
        () => ({ ...props, position: [props.position[0], props.position[1], props.position[2] - 0.2], type: "Static" }),
        useRef(null)
    );
    const [canvasRef] = useBox(
        () => ({ ...props, position: [props.position[0], props.position[1], props.position[2] - 0.5], type: "Static" }),
        useRef(null)
    );

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
                <boxGeometry args={[props.width / 1.25, props.height / 1.5, props.depth - 0.5]} />
                <meshStandardMaterial attach="material" map={artTexture} />
            </mesh>
        </group>
    );
};

export const useForwardRaycast = (obj) => {
    const { raycaster } = useThree();
    const pos = useMemo(() => new Vector3(), []);
    const dir = useMemo(() => new Vector3(), []);
    const scene = useThree((state) => state.scene);

    return () => {
        if (!obj.current) return [];
        raycaster.set(obj.current.getWorldPosition(pos), obj.current.getWorldDirection(dir));
        return raycaster.intersectObjects(scene.children);
    };
};
