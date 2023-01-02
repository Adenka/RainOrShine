import { Button, Typography } from "@mui/material";
import React from "react";
import { makeStyles } from "@mui/styles"
import { useNavigate } from "react-router-dom"

const useStyles = makeStyles({
    root: {
        width: "100%",
        height: "100%",
        position: "fixed",

        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column"
    }
})

const Gamemode = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    return (
        <div className={classes.root}>
            <Typography sx = {{fontSize: 32}}>Gamemode</Typography>
            <Button
                variant = "contained"
                sx = {{minWidth: 200, margin: 2, padding: 2}}
                onClick = {() => navigate("/compare")}
            >
                Compare
            </Button>
            <Button
                variant = "contained"
                sx = {{minWidth: 200, padding: 2}}
                onClick = {() => navigate("/search")}
            >
                Search
            </Button>
        </div>
    );
}

export default Gamemode;