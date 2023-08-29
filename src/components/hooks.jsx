import { useState, useEffect } from "react";
import nipplejs from "nipplejs";

export const usePersonControls = ({ showJoystick }) => {
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

            if (forward > 0) {
                setMovement((m) => ({ ...m, forward: true, backward: false, left: turn < -0.45, right: turn > 0.45 }));
            } else if (forward < 0) {
                setMovement((m) => ({ ...m, backward: true, forward: false, left: turn < -0.45, right: turn > 0.45 }));
            }
        };

        const handleEnd = () => {
            setMovement((m) => ({ ...m, forward: false, backward: false, left: false, right: false }));
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
