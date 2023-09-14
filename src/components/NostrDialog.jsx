import React, { useCallback, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, Container, Grid, Backdrop } from "@mui/material";
import { ArrowForward, ArrowRightAlt } from "@mui/icons-material";

export const NostrDialog = ({ open, setOpen, eventId, setEventId, setImages, isLoading }) => {
    const [eventIdInput, setEventIdInput] = useState(eventId ?? null);

    const handleEventIdChange = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        setEventIdInput(value);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, [setOpen]);

    const handleEnterZeum = useCallback(() => {
        setImages([]);
        setEventId(eventIdInput);
        setOpen(false);
    }, [eventIdInput, setEventId, setImages, setOpen]);

    return (
        <>
            <Dialog open={open} onClose={handleClose} fullScreen>
                <Container sx={{ marginTop: 20 }} maxWidth="sm">
                    <DialogContent sx={{ paddingTop: "5px" }}>
                        <TextField
                            onChange={handleEventIdChange}
                            value={eventIdInput}
                            autoFocus
                            id="nostr-nevent-input"
                            label="Enter Nostr Event ID"
                            fullWidth
                        />
                    </DialogContent>
                    <DialogActions>
                        <Grid container item flex justifyContent="center">
                            <Button onClick={handleEnterZeum} variant="contained" disabled={!eventIdInput || isLoading}>
                                Enter <ArrowForward />
                            </Button>
                        </Grid>
                    </DialogActions>
                </Container>
            </Dialog>
        </>
    );
};
