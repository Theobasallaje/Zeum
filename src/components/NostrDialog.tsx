import React, { useCallback, useState } from "react";
import { Button, TextField, Dialog, DialogActions, DialogContent, Container, Grid } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { useNostrEventIdDecode } from "./Hooks";
import { useNavigate } from "react-router-dom";

export const NostrDialog = ({ open, setOpen }) => {
    const navigate = useNavigate();

    const [eventIdInput, setEventIdInput] = useState("");
    const { decodedId, isValid, validationError } = useNostrEventIdDecode(eventIdInput);

    const handleEventIdChange = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        setEventIdInput(value);
    }, []);

    const handleEnterZeum = useCallback(() => {
        navigate(`./${decodedId}`);
    }, [decodedId, navigate]);

    return (
        <>
            <Container sx={{ marginTop: 20, background: "#fff" }} maxWidth="sm">
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
                    <Grid container item justifyContent="center">
                        <Button onClick={handleEnterZeum} variant="contained" disabled={!isValid}>
                            Enter <ArrowForward />
                        </Button>
                    </Grid>
                </DialogActions>
            </Container>
        </>
    );
};
