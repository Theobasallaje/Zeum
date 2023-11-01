import { Backdrop, Stack, Typography, LinearProgress } from "@mui/material";
import React from "react";

export const BackdropLoader = ({ isLoading, isImagesFound = true }) => {
    return (
        <Backdrop
            sx={{ backgroundColor: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoading || !isImagesFound}
        >
            <Stack>
                <Typography>Loading your Zeum</Typography>
                <LinearProgress />
            </Stack>
        </Backdrop>
    );
};
