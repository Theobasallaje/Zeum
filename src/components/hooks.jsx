import React, { useState, useEffect, useRef, useMemo } from "react";
import { Object3D } from "three";
import { useFrame } from "@react-three/fiber";
import { nip19 } from "nostr-tools";
import nipplejs from "nipplejs";

export const useControls = ({ showJoystick }) => {
    function useJoystick({ show, setMovement }) {
        let joyManager;

        const joystickOptions = {
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

        useEffect(() => {
            const handleMove = (evt, data) => {
                const forward = data.vector.y;
                const turn = data.vector.x;
                const force = data.force;

                if (forward > 0) {
                    setMovement((m) => ({ ...m, forward: 1, backward: 0, left: turn < -0.45, right: turn > 0.45, force }));
                } else if (forward < 0) {
                    setMovement((m) => ({ ...m, backward: 1, forward: 0, left: turn < -0.45, right: turn > 0.45, force }));
                }
            };

            const handleEnd = () => {
                setMovement((m) => ({ ...m, forward: 0, backward: 0, left: 0, right: 0, force: 1 }));
            };

            if (!joyManager && show) {
                joyManager = nipplejs.create(joystickOptions);
                joyManager["0"].on("move", handleMove);
                joyManager["0"].on("end", handleEnd);
            }

            return () => {
                if (joyManager) {
                    joyManager["0"].off("move", handleMove);
                    joyManager["0"].off("end", handleEnd);
                }
            };
        }, [setMovement, show]);
    }

    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        force: 0,
    });

    useJoystick({ show: showJoystick, setMovement });

    useEffect(() => {
        const keys = {
            KeyW: "forward",
            ArrowUp: "forward",
            KeyS: "backward",
            ArrowDown: "backward",
            KeyA: "left",
            ArrowLeft: "left",
            KeyD: "right",
            ArrowRight: "right",
            Space: "jump",
        };
        const moveFieldByKey = (key) => keys[key];
        const handleKeyDown = (e) => {
            setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true, force: 1 }));
        };
        const handleKeyUp = (e) => {
            setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false, force: 1 }));
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("keyup", handleKeyUp);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("keyup", handleKeyUp);
        };
    }, []);

    return movement;
};

export const useNostrEventIdDecode = ({ eventIdInput }) => {
    const [decodedId, setDecodedId] = useState(null);
    const [isValid, setIsValid] = useState(true);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (eventIdInput) {
            setIsValid(true);
            setValidationError(null);
            try {
                const decodedEvent = nip19.decode(eventIdInput);
                if (decodedEvent?.data) {
                    setDecodedId(decodedEvent.data?.id ?? decodedEvent.data);
                } else {
                    setIsValid(false);
                    setValidationError(new Error("Could not decode event ID"));
                }
            } catch (error) {
                setIsValid(false);
                setValidationError(error);
            }
        }
    }, [decodedId, eventIdInput, isValid, validationError]);

    return { decodedId, isValid, validationError };
};

export const Dust = () => {
    const count = 1500;
    const mesh = useRef();

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            const time = Math.random() * 100;
            const factor = Math.random() * 50 + 20;
            const speed = Math.random() * 0.0009;
            const x = Math.random() * 100 - 50;
            const y = Math.random() * 200 - 100;
            const z = Math.random() * 100 - 50;

            temp.push({ time, factor, speed, x, y, z });
        }
        return temp;
    }, []);

    const dummy = useMemo(() => new Object3D(), []);

    useFrame(() => {
        particles.forEach((particle, index) => {
            let { factor, speed, x, y, z } = particle;

            // Update the particle time
            const t = (particle.time += speed);

            // Calculate the falling effect by reducing the y position over time
            y -= speed;

            // Update the particle position based on the time and falling effect
            dummy.position.set(
                x + Math.cos((t / 10) * factor),
                y + Math.sin((t / 5) * factor),
                z + Math.sin((t / 10) * factor)
            );

            dummy.updateMatrix();

            // Apply the matrix to the instanced item
            mesh.current.setMatrixAt(index, dummy.matrix);
        });

        mesh.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={mesh} args={[null, null, count]} receiveShadow castShadow>
            <dodecahedronGeometry args={[0.025, 0]} />
            <meshPhongMaterial color="#ffffff" />
        </instancedMesh>
    );
};
