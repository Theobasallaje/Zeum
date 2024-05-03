import { useState, useEffect, useMemo, useRef } from "react";
import { nip19, kinds } from "nostr-tools";
import nipplejs from "nipplejs";
import { useNostrEvents } from "nostr-react";
import { canDecode, findImageUrlsInEvent, getEventHashTags, getEventText } from "../utils/Utils";
import { useZeumStore } from "./ZeumStore";

export const useControls = () => {
    const { isPlayerInRangeForContextAction, setIsContextActionActive, isContextActionActive } = useZeumStore();

    const [movement, setMovement] = useState({
        forward: false,
        backward: false,
        left: false,
        right: false,
        jump: false,
        force: 0,
    });

    useJoystick({ setMovement });

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
        };
        const moveFieldByKey = (key) => keys[key];
        const handleKeyDown = (e) => {
            if (e.code === "Enter" && (isPlayerInRangeForContextAction || isContextActionActive)) {
                console.log({ isPlayerInRangeForContextAction, isContextActionActive });
                setIsContextActionActive(!isContextActionActive);
            }
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
    }, [isContextActionActive, isPlayerInRangeForContextAction, setIsContextActionActive]);

    return movement;
};

export const useNostrEventIdDecode = (eventIdInput) => {
    const [decodedId, setDecodedId] = useState(null);
    const [isValid, setIsValid] = useState(true);
    const [validationError, setValidationError] = useState(null);

    useEffect(() => {
        if (eventIdInput) {
            setIsValid(true);
            setValidationError(null);

            if (eventIdInput?.startsWith("nostr:")) {
                eventIdInput = eventIdInput.slice(6);
            }

            try {
                if (canDecode(eventIdInput)) {
                    const decodedData = ((nip19.decode(eventIdInput) as nip19.DecodeResult).data as nip19.EventPointer);
                    const decodedId = decodedData?.id;
                    setDecodedId(decodedId ?? decodedData);
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

export const useIsTouchScreen = () => {
    return useMemo(() => {
        return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
    }, []);
};

export const useReadEvent = (eventId) => {
    const { decodedId, isValid, validationError } = useNostrEventIdDecode(eventId);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [images, setImages] = useState([]);
    const [eventText, setEventText] = useState("");
    const [pubkey, setPubkey] = useState("");
    const [tags, setTags] = useState([]);

    const { events, isLoading: isLoadingNostrEvent } = useNostrEvents({
        filter: {
            ids: decodedId ? [decodedId] : undefined,
        },
        enabled: !!decodedId,
    });

    useEffect(() => {
        if (selectedEvent) return;
        const foundEvent = events?.find((event) => event?.id === decodedId);

        if (foundEvent) {
            setSelectedEvent(foundEvent);
            setPubkey(foundEvent?.pubkey);
            const imageUrls = findImageUrlsInEvent(foundEvent);
            const eventText = getEventText(foundEvent);

            if (!!foundEvent?.tags?.length) {
                const eventHashTags = getEventHashTags(foundEvent);
                setTags(eventHashTags);
            }
            setEventText(eventText);
            setImages(imageUrls);
        }
    }, [events, eventId, decodedId, images, pubkey, selectedEvent]);

    return {
        pubkey,
        decodedId,
        images,
        tags,
        eventText,
        isLoadingNostrEvent,
        isError: !isValid,
        error: validationError,
    };
};

export const useNostrReactions = (eventId) => {
    const { decodedId, isValid } = useNostrEventIdDecode(eventId);
    const { events: reactions, isLoading: isLoadingReactions } = useNostrEvents({
        filter: {
            kinds: [kinds.Reaction],
            "#e": decodedId ? [decodedId] : undefined,
        },
        enabled: !!decodedId && isValid,
    });

    return { reactions, isLoadingReactions };
};

export const useNostrProfile = (pubkey) => {
    const { events, isLoading: isLoadingProfile } = useNostrEvents({
        filter: {
            kinds: [kinds.Metadata],
            authors: [pubkey],
        },
        enabled: !!pubkey,
    });

    const profile = useMemo(() => (events?.[0]?.content ? JSON.parse(events?.[0]?.content) : null), [events]);
    return { profile, isLoadingProfile };
};

function useJoystick({ setMovement }) {
    const isTouchScreen = useIsTouchScreen();

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
                setMovement((m) => ({
                    ...m,
                    forward: 1,
                    backward: 0,
                    left: turn < -0.45,
                    right: turn > 0.45,
                    force,
                }));
            } else if (forward < 0) {
                setMovement((m) => ({
                    ...m,
                    backward: 1,
                    forward: 0,
                    left: turn < -0.45,
                    right: turn > 0.45,
                    force,
                }));
            }
        };

        const handleEnd = () => {
            setMovement((m) => ({ ...m, forward: 0, backward: 0, left: 0, right: 0, force: 1 }));
        };

        if (!joyManager && isTouchScreen) {
            // @ts-ignore
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
    }, [setMovement]);
}
