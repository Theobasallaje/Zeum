import React, { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { ExitPlane, Dust } from "./Environment";
import { PlayerControls } from "./PlayerControls";
import { findImageUrlsInEvent } from "../utils/Utils";
import { useNostrEvents } from "nostr-react";
import { BackdropLoader } from "./BackdropLoader";
import { useZeumStore } from "./ZeumStore";
import { ContextActions } from "./ContextActions";
import { Box } from "@mui/material";
import { ArtifactRoom } from "./ArtifactRoom";

export const Scene = () => {
    const mainCameraRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const { eventId } = useParams();
    const navigate = useNavigate();
    const { setIsContextActionActive, getRoomDepth, setArtifacts, artifacts, showJoystick } = useZeumStore();
    const { events, isLoading: isLoadingNostrEvent } = useNostrEvents({
        filter: {
            ids: eventId ? [eventId] : undefined,
        },
        enabled: !!eventId,
    });
    const roomDepth = getRoomDepth();
    const handleExit = useCallback(() => {
        setArtifacts([]);
        navigate("/");
    }, [navigate, setArtifacts]);

    const handleStartContextAction = useCallback(() => {
        setIsContextActionActive(true);
    }, [setIsContextActionActive]);

    const handleEndContextAction = useCallback(
        (e) => {
            setIsContextActionActive(false);
        },
        [setIsContextActionActive]
    );

    const isArtifactsFound = useMemo(() => artifacts?.length > 0, [artifacts]);

    useEffect(() => {
        const selectedEvent = events?.find((event) => event?.id === eventId);
        if (selectedEvent && artifacts?.length < 1) {
            const imageUrls = findImageUrlsInEvent(selectedEvent);
            setArtifacts(imageUrls);
        }
    }, [events, eventId, artifacts, setArtifacts, isArtifactsFound]);

    useEffect(() => {
        let timer;
        if (isLoadingNostrEvent) {
            setIsLoading(true);
        } else {
            setIsLoading(true);
            timer = setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }

        return () => clearTimeout(timer);
    }, [isLoadingNostrEvent]);

    return (
        <>
            {isLoading || !isArtifactsFound ? (
                <BackdropLoader
                    loadingText="Loading your zeum"
                    isLoading={isLoading}
                    isImagesFound={isArtifactsFound}
                />
            ) : (
                <>
                    <Canvas
                        dpr={[1, 2]}
                        camera={{ far: 100, near: 1, position: [0, 10, -10], zoom: 50, fov: 50 }}
                        orthographic
                        shadows
                        style={{ zIndex: 0 }}
                    >
                        <ambientLight intensity={2} position={[0, 10, 4]} />
                        <Physics iterations={1}>
                            <Dust />
                            <ArtifactRoom />
                            <PlayerControls startPosition={[0, 0, -(roomDepth / 2.5)]} mainCameraRef={mainCameraRef} />
                            <ExitPlane roomHeight={roomDepth} handleExit={handleExit} />
                        </Physics>
                    </Canvas>
                    <ContextActions
                        handleStartContextAction={handleStartContextAction}
                        handleEndContextAction={handleEndContextAction}
                    />
                    <Box id="mobileInterface" className="noSelect">
                       <div id="joystickWrapper1" style={{ display: showJoystick ? "block" : "none" }} />
                    </Box>
                </>
            )}
        </>
    );
};
