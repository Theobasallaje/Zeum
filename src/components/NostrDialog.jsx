import React, { useCallback, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, Container, Grid } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNostrEventIdDecode } from "./Hooks";

export const NostrDialog = ({ open, setOpen, eventId, setEventId, setImages, setIsLoadingRoom }) => {
    const [eventIdInput, setEventIdInput] = useState(eventId ?? "");
    const { decodedId, isValid, validationError } = useNostrEventIdDecode({ eventIdInput });

    const handleEventIdChange = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        setEventIdInput(value);
    }, []);

    const handleEnterZeum = useCallback(() => {
        setImages([]);

        setIsLoadingRoom(true);
        setEventId(decodedId);
        setOpen(false);

        setTimeout(() => setIsLoadingRoom(false), 3000);
    }, [decodedId, setEventId, setImages, setIsLoadingRoom, setOpen]);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullScreen>
                <Container sx={{ marginTop: 20 }} maxWidth="sm">
                    <DialogContent sx={{ paddingTop: "5px" }}>
                        <TextField
                            onChange={handleEventIdChange}
                            value={eventIdInput}
                            id="nostr-nevent-input"
                            label="Enter Nostr Event ID"
                            error={!isValid}
                            helperText={validationError?.message}
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Grid container item flex justifyContent="center">
                            <Button onClick={handleEnterZeum} variant="contained" disabled={!isValid}>
                                Enter <ArrowForward />
                            </Button>
                        </Grid>
                    </DialogActions>
                </Container>
            </Dialog>
        </>
    );
};
