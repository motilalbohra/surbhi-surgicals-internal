// theme.js
import {createTheme} from "@mui/material/styles";

const theme = createTheme({
    typography: {
        fontSize: 16, // Base font size (default is 14)
        h6: {
            fontSize: "1.4rem",
            fontWeight: 600,
        },
        subtitle2: {
            fontSize: "1.1rem",
        },
        body1: {
            fontSize: "1.1rem",
        },
        body2: {
            fontSize: "1rem",
        },
        button: {
            fontSize: "1rem",
        },
    },
});

export default theme;
