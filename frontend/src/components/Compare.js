import React, { useContext, useEffect, useState } from "react";
import {
    Checkbox, FormControlLabel,
    TableContainer, Table, TableCell, TableRow, TableHead, TableBody, TableSortLabel,
    IconButton, Autocomplete, TextField, Button, Drawer, Paper, Slider, Typography, Grid } from "@mui/material"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from "react-router-dom";
import { weatherFeatures } from "../assets/weatherFeatures";
import { PlacesContext } from "./PlacesContext";
import TuneIcon from '@mui/icons-material/Tune';
import { useFetchApi } from "../utils/apiMiddleware"

const calculateOneFeature = (weatherData, weatherFeatureName, id) => {
    return Math.floor(weatherData.reduce((sum, record) => record["ID_PLACE"] === id ? sum + record[weatherFeatureName] : sum, 0) * 100 / weatherData.length) / 100
}

const calculateOneMaxFeature = (weatherData, weatherFeatureName, id) => {
    return Math.floor(weatherData.reduce(
        (maxxx, record) => record["ID_PLACE"] === id
                            ? Math.max(maxxx, record[weatherFeatureName])
                            : maxxx,
                            -1000
                        ) * 100) / 100
}

const calculateOneMinFeature = (weatherData, weatherFeatureName, id) => {
    return Math.floor(weatherData.reduce((minnn, record) => record["ID_PLACE"] === id ? Math.min(minnn, record[weatherFeatureName]) : minnn, 1000) * 100) / 100
}

const calculateWeather = (weatherData, id) => {
    const weather = {};
    weather["Record high"] = calculateOneMaxFeature(weatherData, "TEMP_MAX", id);
    weather["Average high"] = calculateOneFeature(weatherData, "TEMP_AVG_MAX", id);
    weather["Daily mean"] = calculateOneFeature(weatherData, "TEMP_AVG", id);
    weather["Average low"] = calculateOneFeature(weatherData, "TEMP_AVG_MIN", id);
    weather["Record low"] = calculateOneMinFeature(weatherData, "TEMP_MIN", id);
    weather["Average precipitation"] = calculateOneFeature(weatherData, "RAIN_AVG", id);
    weather["Average precipitation days"] = calculateOneFeature(weatherData, "RAIN_DAYS_AVG", id);
    weather["Mean monthly sunshine hours"] = calculateOneFeature(weatherData, "SUN_HOURS_AVG", id);

    return weather;
}

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
        const xd = newPlaces.map((newPlace) => (newPlace["placeId"]));
        console.log(xd);
        setPlaces(xd);
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
    const {places, timeSpan, setTimeSpan} = useContext(PlacesContext)
    const [data, setData] = useState([]);
    const fetchApi = useFetchApi();

    const getStartingWeather = async () => {
        const startingWeather = await fetchApi(
            "searchForWeather",
            {
                ids: places,
                left: timeSpan[0],
                right: timeSpan[1]
            }
        )
        console.log(startingWeather)
        return startingWeather
    }

    const fetchStartingWeather = async () => {
        const beginPlaces = await getStartingWeather();
        let placesIdsNames = beginPlaces.map(
                beginPlace => ({placeId: beginPlace["ID_PLACE"], placeName: beginPlace["PLACE_NAME"]})
            );
        placesIdsNames = placesIdsNames.filter((value, index, self) =>
            index === self.findIndex((t) => (
                t.placeId === value.placeId && t.placeName === value.placeName
            ))
        )
        console.log(placesIdsNames);
        const beginPlacesBetter = placesIdsNames.map(placeIdName => (
            {
                placeId: placeIdName["placeId"],
                placeName: placeIdName["placeName"],
                weather: calculateWeather(beginPlaces, placeIdName["placeId"])
            }
        ))
        
        console.log(beginPlacesBetter);
        setData(beginPlacesBetter)
    }

    useEffect(() => {
        console.log(places)
        
        fetchStartingWeather()
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

    const getRow = async (id, left, right) => {
        console.log(id, left, right);
        const newRow = await fetchApi(
            "searchIdPeriod",
            {
                id: id,
                left: left,
                right: right
            }
        )
        
        console.log(newRow)
        return {
            placeId: newRow[0]["ID_PLACE"],
            placeName: newRow[0]["PLACE_NAME"],
            weather: calculateWeather(newRow, newRow[0]["ID_PLACE"])
        }
    }

    const handleValueChange = async (event, newValue) => {
        if (!newValue) {
            setValue(newValue);
            return;
        }
        
        console.log(newValue);
        setValue(newValue["label"]);
        
        const isThere = data.some(elem => elem.placeId === newValue["id"]);
        
        if (!isThere) {
            console.log(newValue["id"])
            const actualData = await getRow(newValue["id"], timeSpan[0], timeSpan[1])
            console.log(actualData)
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

    const [options, setOptions] = useState([]);

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

    const getOptions = async () => {
        const prefix = inputValue;
        const newOptions = await fetchApi(
            "searchAllLikePrefix",
            {
                prefix: prefix
            }
        )
        setOptions(newOptions)
    }

    React.useEffect(() => {
        getOptions()
    }, [value, inputValue])

    return (
        <div style = {{width: "100%", height: "100%", position: "fixed"}}>
            <ShowOnMapButton newPlaces={data}/>
            <Paper style = {{padding: 40, display: "flex", margin: 10, marginRight: 20}}>
                <Autocomplete
                    renderInput = {(params) => (<TextField {...params} label = "Add a location"/>)}
                    options = {options.map(
                        option => ({id: option["ID_PLACE"], label: option["PLACE_NAME"]})
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
                                    defaultValue = {[timeSpan[0] + 1, timeSpan[1] + 1]}
                                    valueLabelDisplay = "auto"
                                    marks
                                    step = {1}
                                    min = {1}
                                    max = {12}
                                    sx = {{width: 200}}
                                    onChangeCommitted = {
                                        (_, newValue) => setTimeSpan([newValue[0] - 1, newValue[1] - 1])
                                    }
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