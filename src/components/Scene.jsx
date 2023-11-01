import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/cannon";
import { ExitPlane } from "./Environment";
import { PlayerControls } from "./PlayerControls";
import { SingleArtifactRoom } from "./rooms/SingleArtifactRoom";
import { DoubleArtifactRoom } from "./rooms/DoubleArtifactRoom";
import { TripleArtifactRoom } from "./rooms/TripleArtifactRoom";

import { Dust } from "./Hooks";
import { findImageUrlsInEvent } from "../utils/Utils";
import { useNostrEvents } from "nostr-react";
import { BackdropLoader } from "./BackdropLoader";
import { Container, Stack, Button } from "@mui/material";
import { toast } from "react-toastify";

export const Scene = () => {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [images, setImages] = useState([]);

    const { events, isLoading: isLoadingNostrEvent } = useNostrEvents({
        filter: {
            ids: eventId ? [eventId] : undefined,
        },
        enabled: !!eventId,
    });

    const roomDepth = useMemo(() => {
        if (images?.length === 1) return 50;
        if (images?.length === 2) return 62.5;
        if (images?.length >= 3) return 78.125;
    }, [images]);

    const isTouchScreen = useMemo(() => {
        return "maxTouchPoints" in navigator ? navigator.maxTouchPoints > 0 : false;
    }, []);

    const handleExit = useCallback(() => {
        navigate("/Zeum");
    }, [navigate]);

    const isImagesFound = useMemo(() => images?.length > 0, [images]);

    const handleShare = useCallback(() => {
        const currentUrl = window.location.href;
        if (isTouchScreen) {
            navigator
                .share({ url: currentUrl })
                .then(() => {
                    console.log("Sharing success");
                })
                .catch((error) => {
                    console.error("Sharing failed:", error);
                });
        } else {
            navigator.clipboard
                .writeText(currentUrl)
                .then(() => {
                    toast.success("Copied!");
                })
                .catch((error) => {
                    toast.error("Failed to copy to clipboard!");
                });
        }
    }, []);

    const [isLoading, setIsLoading] = useState(false);

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
            {(isLoading || !isImagesFound) && <BackdropLoader isLoading={isLoading} isImagesFound={isImagesFound} />}
            {isImagesFound && (
                <>
                    <Container maxWidth="xl">
                        <Stack direction="row-reverse" marginTop={2}>
                            <Button color="primary" disableElevation variant="contained" onClick={handleShare}>
                                Share
                            </Button>
                        </Stack>
                    </Container>
                    <Canvas
                        dpr={[1, 2]}
                        camera={{ far: 100, near: 1, position: [0, 10, -10], zoom: 50, fov: 50 }}
                        orthographic
                        shadows
                    >
                        <ambientLight intensity={2} position={[0, 10, 4]} />
                        <Physics iterations={15} gravity={[0, -15, 0]}>
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
                            <PlayerControls showJoystick={isTouchScreen} startPosition={[0, 0, -(roomDepth / 2.5)]} />
                            <ExitPlane roomHeight={roomDepth} handleExit={handleExit} />
                        </Physics>
                    </Canvas>
                </>
            )}
        </>
    );
};
