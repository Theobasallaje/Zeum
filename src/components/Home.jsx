import { Button, Container, Grid, TextField, Box } from "@mui/material";
import React, { useState, useCallback } from "react";
import { ArrowForward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useNostrEventIdDecode } from "./Hooks";

export const Home = () => {
    const navigate = useNavigate();

    const [eventIdInput, setEventIdInput] = useState("");
    const { decodedId, isValid, validationError } = useNostrEventIdDecode({ eventIdInput });

    const handleEventIdChange = useCallback((e) => {
        const value = e.target.value.toLowerCase();
        setEventIdInput(value);
    }, []);

    const handleEnterZeum = useCallback(() => {
        navigate(`./${decodedId}`);
    }, [decodedId, navigate]);

    return (
        <Box sx={{ height: "100vh", backgroundColor: "#fff" }}>
            <Grid container justifyContent="center">
                <Grid item xs={8} marginTop={20}>
                    <Container maxWidth="md">
                        <TextField
                            onChange={handleEventIdChange}
                            value={eventIdInput}
                            id="nostr-nevent-input"
                            label="Enter Nostr Event ID"
                            error={!isValid}
                            helperText={validationError?.message}
                            fullWidth
                        />

                        <Grid container item justifyContent="center" marginTop={5}>
                            <Button onClick={handleEnterZeum} variant="contained" disabled={!isValid}>
                                Enter <ArrowForward />
                            </Button>
                        </Grid>
                    </Container>
                </Grid>
            </Grid>
        </Box>
    );
};
