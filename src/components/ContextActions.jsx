import { Visibility, Close } from "@mui/icons-material";
import { Box, Button, IconButton } from "@mui/material";
import React, { useCallback, useRef } from "react";
import { toast } from "react-toastify";
import { useZeumStore } from "./ZeumStore";
import { useIsTouchScreen } from "./Hooks";

export const ContextActions = ({ handleStartContextAction, handleEndContextAction }) => {
    const isTouchScreen = useIsTouchScreen();
    const { isPlayerInRangeForContextAction, isContextActionActive } = useZeumStore();

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
    }, [isTouchScreen]);

    return (
        <>
            <Box sx={{ position: "absolute", top: 0, right: 0, zIndex: 1500 }}>
                {!isContextActionActive ? (
                    <Button color="primary" disableElevation variant="contained" onClick={handleShare} sx={{ m: 2 }}>
                        Share
                    </Button>
                ) : null}
            </Box>
            <Box sx={{ position: "absolute", bottom: 0, left: "35vw", zIndex: 1500, m: 2 }}>
                {isPlayerInRangeForContextAction && !isContextActionActive ? (
                    <IconButton
                        title="Get a closer look"
                        onClick={handleStartContextAction}
                        sx={{ backgroundColor: "white", opacity: 0.5 }}
                    >
                        <Visibility fontSize="large" />
                    </IconButton>
                ) : null}
            </Box>
            <Box sx={{ position: "absolute", bottom: 0, right: isTouchScreen ? "10vw" : "35vw", zIndex: 1500, m: 2 }}>
                {isContextActionActive ? (
                    <IconButton title="Close" onClick={handleEndContextAction} sx={{ backgroundColor: "white" }}>
                        <Close fontSize="large" />
                    </IconButton>
                ) : null}
            </Box>
        </>
    );
};
