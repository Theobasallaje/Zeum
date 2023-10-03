import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
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
                    setMovement((m) => ({ ...m, forward: force, backward: 0, left: turn < -0.45, right: turn > 0.45 }));
                } else if (forward < 0) {
                    setMovement((m) => ({ ...m, backward: force, forward: 0, left: turn < -0.45, right: turn > 0.45 }));
                }
            };

            const handleEnd = () => {
                setMovement((m) => ({ ...m, forward: 0, backward: 0, left: 0, right: 0 }));
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
            setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: true }));
        };
        const handleKeyUp = (e) => {
            setMovement((m) => ({ ...m, [moveFieldByKey(e.code)]: false }));
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

export const BasicParticles = () => {
    // This reference gives us direct access to our points
    const points = useRef();

    // You can see that, like our mesh, points also takes a geometry and a material,
    // but a specific material => pointsMaterial
    return (
        <points ref={points}>
            <sphereGeometry args={[1, 48, 48]} />
            <pointsMaterial color="#5786F5" size={0.015} sizeAttenuation />
        </points>
    );
};
