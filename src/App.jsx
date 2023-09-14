import { useMemo, useState, useEffect } from "react";
import { NostrDialog } from "./components/NostrDialog";
import { Container, Button, Backdrop, Typography, LinearProgress, Stack } from "@mui/material";
import { useNostrEvents } from "nostr-react";
import { findImageUrlsInEvent } from "./utils/Utils";
import { Scene } from "./components/Scene";
import { ArrowBack } from "@mui/icons-material";

export const App = ({ debug }) => {
    const [open, setOpen] = useState(true);
    const [eventId, setEventId] = useState(null);
    const [images, setImages] = useState([]);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const { events, isLoading } = useNostrEvents({
        filter: {
            ids: [eventId],
        },
        enabled: !!eventId,
    });

    const selectedEvent = useMemo(() => events.find((event) => event.id === eventId), [eventId, events]);
    const noImagesFound = useMemo(() => !!selectedEvent && images?.length < 1, [images?.length, selectedEvent]);

    useEffect(() => {
        if (selectedEvent && images?.length < 1) {
            const imageUrls = findImageUrlsInEvent(selectedEvent);
            setImages(imageUrls);
        }
    }, [events, eventId, images, selectedEvent]);

    useEffect(() => {
        if (debug) {
            console.log({ eventId, selectedEvent, images });
        }
    }, [debug, eventId, images, selectedEvent]);

    return (
        <>
            <Backdrop
                sx={{ backgroundColor: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={isLoading || noImagesFound}
            >
                {noImagesFound ? (
                    <Stack>
                        <Typography>
                            We could not generate a zeum from this note because it does not contain any readable media.
                        </Typography>
                        <Button color="primary" disableElevation variant="contained" onClick={handleClickOpen}>
                            <ArrowBack /> Back
                        </Button>
                    </Stack>
                ) : (
                    <Stack>
                        <Typography>Loading your Zeum</Typography>
                        <LinearProgress />
                    </Stack>
                )}
            </Backdrop>
            <Container>
                <Stack direction="row-reverse" marginTop={2}>
                    <Button color="primary" disableElevation variant="contained" onClick={handleClickOpen}>
                        Exit Zeum
                    </Button>
                </Stack>
            </Container>
            <NostrDialog
                open={open}
                setOpen={setOpen}
                eventId={eventId}
                setEventId={setEventId}
                setImages={setImages}
                isLoading={isLoading}
            />
            {eventId && images?.length > 0 && <Scene images={images} />}
        </>
    );
};
