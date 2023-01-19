import { Alert, Snackbar } from "@mui/material";
import React, { useContext } from "react";
import { ErrorContext } from "./ErrorContext";

function SnackBar() {
    const {
        isMessageOn, setIsMessageOn,
        currentSeverity,
        currentMessage
    } = useContext(ErrorContext);    

    const handleCloseSnackBar = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setIsMessageOn(false);
    }

    console.log("current message: ", currentMessage);
    
    return <Snackbar
        open = {isMessageOn}
        autoHideDuration = {2000}
        onClose = {handleCloseSnackBar}
    >
        <Alert
            variant = "filled"
            severity = {currentSeverity}
            sx = {{fontSize: "1rem", letterSpacing: "0.125rem"}}
        >
            {currentMessage}
        </Alert>
    </Snackbar>
}

export default SnackBar;