import React, { useContext, useEffect, useState } from "react";
import {
    Checkbox, FormControlLabel, FormGroup,
    TableContainer, Table, TableCell, TableRow, TableHead, TableBody, TableSortLabel,
    IconButton, Autocomplete, TextField, Button, setRef, Drawer, Paper, Slider, Typography, Grid } from "@mui/material"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from "react-router-dom";
import { weatherFeatures } from "../assets/weatherFeatures";
import { PlacesContext } from "./PlacesContext";
import { exampleData } from "../assets/exampleData";
import TuneIcon from '@mui/icons-material/Tune';

const descendingComparator = (a, b, orderBy) => {
    if (b["weather"][orderBy] < a["weather"][orderBy]) {
        return -1;
    }
    if (b["weather"][orderBy] > a["weather"][orderBy]) {
        return 1;
    }

    return 0;
}

const getComparator = (order, orderBy) => {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const ShowOnMapButton = ({newPlaces}) => {
    const { setPlaces } = useContext(PlacesContext);
    const navigate = useNavigate();

    const handleOnClick = () => {
        setPlaces(newPlaces.map((newPlace) => (newPlace["placeId"])));
        navigate("/search");
    }

    return <Button
        variant = "contained"
        onClick = {handleOnClick}
        sx = {{
            position: "fixed",
            right: 60,
            bottom: 60,
            fontSize: 16,
            padding: 2
        }}
    >
        Show on map!
    </Button>
}

const EnhancedTableHead = (props) => {
    const { order, orderBy, isShown, handleRequestSort } = props;

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell sx = {{fontSize: 18}}>
                    Name
                </TableCell>
                {weatherFeatures.map(((weatherFeature, id) => (
                    (isShown[weatherFeature])
                    ?
                    <TableCell
                        key = {id}
                        sortDirection = {orderBy === weatherFeature ? order : false}
                        sx = {{fontSize: 18}}
                    >
                        <TableSortLabel
                            active = {orderBy === weatherFeature}
                            direction = {orderBy === weatherFeature ? order : "asc"}
                            onClick = {createSortHandler(weatherFeature)}
                        >
                            {weatherFeature}
                        </TableSortLabel>
                    </TableCell>
                    :
                    <></>
                )))}
            </TableRow>
        </TableHead>
    )
}

const Compare = () => {
    const {places} = useContext(PlacesContext)
    const [data, setData] = useState([]);

    useEffect(() => {
        console.log(places)
        const beginPlaces
            = places.map((placeId => (exampleData.find(dataPlace => dataPlace["placeId"] === placeId))));
        console.log(beginPlaces);
        setData(beginPlaces)
    }, [])

    const handleRemoveClicked = (index) => {
        setData(prevData => prevData.filter((_, i) => i !== index))
    }

    const [isShown, setIsShown] = useState({
        "Record high":  true,
        "Average high": true,
        "Daily mean":   true,
        "Average low":  true,
        "Record low":   true,
        "Average precipitation":        true,
        "Average precipitation days":   true,
        "Mean monthly sunshine hours":  true
    })

    const handleCheckClicked = (weatherFeature) => {
        setIsShown(prevIsShown => ({
            ...prevIsShown,
            [weatherFeature]: !prevIsShown[weatherFeature]
        }))
    }

    const handleValueChange = (event, newValue) => {
        if (!newValue) {
            setValue(newValue);
            return;
        }

        setValue(newValue["label"]);
        
        const isThere = data.some(elem => elem.placeId === newValue["id"]);
        
        if (!isThere) {
            const actualData = exampleData.find(elem => elem.placeId === newValue["id"]);
            setData(prevData => [
                ...prevData,
                {
                    placeId: actualData["placeId"],
                    placeName: actualData["placeName"],
                    weather: actualData["weather"]
                }
            ])
        }
    }

    const [options, setOptions] = useState(exampleData);

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("Record high");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const [drawerOpen, setDrawerOpen] = useState(false)

    React.useEffect(() => {
        // query
    }, [value, inputValue])

    return (
        <div style = {{width: "100%", height: "100%", position: "fixed"}}>
            <ShowOnMapButton newPlaces={data}/>
            <Paper style = {{padding: 40, display: "flex", margin: 10, marginRight: 20}}>
                <Autocomplete
                    renderInput = {(params) => (<TextField {...params} label = "Add a location"/>)}
                    options = {options.map(
                        option => ({id: option["placeId"], label: option["placeName"]})
                    )}
                    value = {value}
                    onChange = {(event, newValue) => handleValueChange(event, newValue)}
                    onInputChange = {(event, newInputValue) => {
                        setInputValue(newInputValue)
                    }}
                    fullWidth
                />
                <IconButton
                    style ={{ marginLeft: 40, width: 60, height: 60 }}
                    onClick = {() => setDrawerOpen(true)}
                >
                    <TuneIcon/>
                </IconButton>
            </Paper>
            <div style = {{display: "flex", justifyItems: "center"}}>
                <Drawer
                    anchor = "bottom"
                    open = {drawerOpen}
                    onClose = {() => setDrawerOpen(false)}
                >
                    <div style = {{paddingLeft: 50, width: "calc(100vw - 100px)", marginBottom: 50}}>
                        <Typography
                            variant = "h4"
                            sx = {{
                                width: "100%",
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: 6,
                                paddingBottom: 6,
                            }}
                        >
                            Adjust
                        </Typography>
                        <div style = {{display: "flex"}}>
                            <div style = {{width: "20%", display: "flex", flexDirection: "column", alignItems: "center"}}>
                                <Typography sx = {{fontSize: 20, padding: "20px"}}>Time span</Typography>
                                <Slider
                                    defaultValue = "Time span"
                                    valueLabelDisplay = "auto"
                                    marks
                                    step = {1}
                                    min = {1}
                                    max = {12}
                                    sx = {{width: 200}}
                                />
                            </div>
                            <div style = {{width: "100%", marginLeft: 100}}>
                                <Grid container spacing = {2}>
                                    {weatherFeatures.filter(((_, index) => index < 5))
                                                    .map(weatherFeature =>
                                        <Grid item xs = {2.4}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked = {isShown[weatherFeature]}
                                                        onChange={() => handleCheckClicked(weatherFeature)}
                                                    />
                                                }
                                                label = {
                                                    <Typography style = {{fontSize: 20, padding: 20}}>
                                                        {weatherFeature}
                                                    </Typography>
                                                }
                                            />
                                        </Grid>
                                    )}
                                <Grid container spacing = {2}>
                                </Grid>
                                    {weatherFeatures.filter(((_, index) => index >= 5))
                                                    .map(weatherFeature =>
                                        <Grid item xs = {2.4}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked = {isShown[weatherFeature]}
                                                        onChange={() => handleCheckClicked(weatherFeature)}
                                                    />
                                                }
                                                label = {
                                                    <Typography style = {{fontSize: 20, padding: 20}}>
                                                        {weatherFeature}
                                                    </Typography>
                                                }
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </div>
                        </div>
                    </div>
                </Drawer>
                <Paper style = {{padding: 50, margin: 10, marginRight: 20, height: "calc(100vh - 295px)"}}>
                    <TableContainer style = {{maxHeight: 750}}>
                        <Table stickyHeader style = {{ tableLayout: "fixed" }}>
                            <EnhancedTableHead
                                order = {order}
                                orderBy = {orderBy}
                                isShown = {isShown}
                                handleRequestSort = {handleRequestSort}
                            />
                            <TableBody>
                                {data.slice().sort(getComparator(order, orderBy))
                                .map((entry, index) => {
                                    return (
                                        <TableRow>
                                            <TableCell sx = {{fontSize: 16}}> 
                                                <IconButton onClick = {() => handleRemoveClicked(index)}>
                                                    <RemoveCircleIcon/>
                                                </IconButton>
                                                {entry.placeName}
                                            </TableCell>
                                            {weatherFeatures.map(weatherFeature =>
                                                (isShown[weatherFeature])
                                                ?
                                                <TableCell sx = {{fontSize: 16}}>
                                                    {entry.weather[weatherFeature]}
                                                </TableCell>
                                                :
                                                <></>
                                            )}
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </div>
        </div>
    );
}

export default Compare;