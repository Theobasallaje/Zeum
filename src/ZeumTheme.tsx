import { createTheme } from "@mui/material";

export const ZeumTheme = createTheme({
    components: {
       
        MuiCard: {
            styleOverrides: {
                root: {
                    border: "3px solid",
                },
            },
        },
    },
});
