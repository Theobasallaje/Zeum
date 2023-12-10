import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { ExitPlane, Dust } from "./Environment";
import { PlayerControls } from "./PlayerControls";
import { SingleArtifactRoom } from "./rooms/SingleArtifactRoom";
import { DoubleArtifactRoom } from "./rooms/DoubleArtifactRoom";
import { TripleArtifactRoom } from "./rooms/TripleArtifactRoom";
import { findImageUrlsInEvent } from "../utils/Utils";
import { useNostrEvents } from "nostr-react";
import { BackdropLoader } from "./BackdropLoader";
import { Button, Box, IconButton } from "@mui/material";
import { toast } from "react-toastify";
import { Close, Visibility } from "@mui/icons-material";
import { useZeumStore } from "./ZeumStore";
import { ContextActions } from "./ContextActions";
import { useIsTouchScreen } from "./Hooks";

export const Scene = () => {
    const mainCameraRef = useRef(null);

    const [isLoading, setIsLoading] = useState(false);
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);
    const { setIsContextActionActive } = useZeumStore();
    const { events, isLoading: isLoadingNostrEvent } = useNostrEvents({
        filter: {
            ids: eventId ? [eventId] : undefined,
        },
        enabled: !!eventId,
    });
    const isArtifactsFound = useMemo(() => images?.length > 0, [images]);
    const roomDepth = useMemo(() => {
        if (images?.length === 1) return 50;
        if (images?.length === 2) return 62.5;
        if (images?.length >= 3) return 78.125;
    }, [images]);

    const handleExit = useCallback(() => {
        navigate("/");
    }, [navigate]);

    const handleStartContextAction = useCallback(() => {
        setIsContextActionActive(true);
    }, [setIsContextActionActive]);

    const handleEndContextAction = useCallback(
        (e) => {
            setIsContextActionActive(false);
        },
        [setIsContextActionActive]
    );

    useEffect(() => {
        const selectedEvent = events?.find((event) => event?.id === eventId);
        if (selectedEvent && images?.length < 1) {
            const imageUrls = findImageUrlsInEvent(selectedEvent);
            setImages(imageUrls);
        }
    }, [events, eventId, images]);

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
                <BackdropLoader isLoading={isLoading} isImagesFound={isArtifactsFound} />
            ) : (
                <>
                    <ContextActions
                        handleStartContextAction={handleStartContextAction}
                        handleEndContextAction={handleEndContextAction}
                    />
                    <Canvas
                        dpr={[1, 2]}
                        camera={{ far: 100, near: 1, position: [0, 10, -10], zoom: 50, fov: 50 }}
                        orthographic
                        shadows
                    >
                        <ambientLight intensity={2} position={[0, 10, 4]} />
                        <Physics iterations={15}>
                            <Dust />
                            {images?.length === 1 && (
                                <SingleArtifactRoom artifact={images[0]} roomDepth={roomDepth} roomWidth={50} />
                            )}
                            {images?.length === 2 && (
                                <DoubleArtifactRoom artifacts={images} roomDepth={roomDepth} roomWidth={50} />
                            )}
                            {images?.length >= 3 && (
                                <TripleArtifactRoom artifacts={images} roomDepth={roomDepth} roomWidth={50} />
                            )}
                            <PlayerControls startPosition={[0, 0, -(roomDepth / 2.5)]} mainCameraRef={mainCameraRef} />
                            <ExitPlane roomHeight={roomDepth} handleExit={handleExit} />
                        </Physics>
                    </Canvas>
                </>
            )}
        </>
    );
};
