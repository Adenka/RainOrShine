import React, { useState } from "react";
import {
    Checkbox, FormControlLabel, FormGroup,
    TableContainer, Table, TableCell, TableRow, TableHead, TableBody, TableSortLabel,
    IconButton, Autocomplete, TextField, Button } from "@mui/material"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from "react-router-dom";

const weatherFeatures = [
    "Record high",
    "Average high",
    "Daily mean",
    "Average low",
    "Record low",
    "Average precipitation",
    "Average precipitation days",
    "Mean monthly sunshine hours"
];

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

const ShowOnMapButton = () => {
    const navigate = useNavigate();

    return <Button
        variant = "contained"
        onClick = {() => navigate("/search")}
        sx = {{
            position: "fixed",
            right: 60,
            bottom: 60,
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
                <TableCell>
                    Name
                </TableCell>
                {weatherFeatures.map(((weatherFeature, id) => (
                    (isShown[weatherFeature])
                    ?
                    <TableCell
                        key = {id}
                        sortDirection = {orderBy === weatherFeature ? order : false}
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
    const generateWeather = () => {
        return {
            "Record high": Math.floor(Math.random() * 10000) / 100,
            "Average high": Math.floor(Math.random() * 10000) / 100,
            "Daily mean": Math.floor(Math.random() * 10000) / 100,
            "Average low": Math.floor(Math.random() * 10000) / 100,
            "Record low": Math.floor(Math.random() * 10000) / 100,

            "Average precipitation":        Math.floor(Math.random() * 10000) / 100,
            "Average precipitation days":   Math.floor(Math.random() * 3000) / 100,
            "Mean monthly sunshine hours":  Math.floor(Math.random() * 2400) / 100
        }
    }

    const [data, setData] = useState([
        {
            placeName: "wadowice",
            weather: generateWeather()
        },
        {
            placeName: "vegas baby",
            weather: generateWeather()
        },
        {
            placeName: "mars",
            weather: generateWeather()
        },
    ]);

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
        //setOptions(newValue ? [newValue, ...options] : options);
        setValue(newValue);
        
        // TODO - nazwy mogą być te same!
        const isThere = data.some(elem => elem.placeName === newValue)

        if (!isThere && newValue) {
            setData(prevData => [...prevData, {placeName: newValue, weather: generateWeather()}])
        }
    }

    const [options, setOptions] = useState([
        "alabama", "bahamy", "cypr", "dakota", "eukaliptus", "fiordy", "geordżina", "himalaje", "indonezja"
    ]);

    const [value, setValue] = useState(null);
    const [inputValue, setInputValue] = useState('');

    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("Record high");

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    React.useEffect(() => {
        // query
    }, [value, inputValue])

    return (
        <div style = {{width: "100%", height: "100%", position: "fixed"}}>
            <ShowOnMapButton/>
            <div style = {{padding: 50}}>
                <Autocomplete
                    renderInput={(params) => (<TextField {...params} label = "Add a location"/>)}
                    options = {options}
                    value = {value}
                    onChange = {(event, newValue) => handleValueChange(event, newValue)}
                    onInputChange = {(event, newInputValue) => {
                        setInputValue(newInputValue)
                    }}
                    fullWidth
                />
            </div>
            <div style = {{display: "flex", justifyItems: "center"}}>
                <div style = {{minWidth: 300, paddingLeft: 50}}>
                    <FormGroup>
                        {weatherFeatures.map(weatherFeature =>
                            <FormControlLabel control={
                                <Checkbox
                                    checked = {isShown[weatherFeature]}
                                    onChange={() => handleCheckClicked(weatherFeature)}
                                />
                            } label = {weatherFeature}/>
                        )}
                    </FormGroup>
                </div>
                <div style = {{paddingRight: 50}}>
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
                                        <TableCell> 
                                            <IconButton onClick = {() => handleRemoveClicked(index)}>
                                                <RemoveCircleIcon/>
                                            </IconButton>
                                            {entry.placeName}
                                        </TableCell>
                                        {weatherFeatures.map(weatherFeature =>
                                            (isShown[weatherFeature])
                                            ?
                                            <TableCell>
                                                {entry.weather[weatherFeature]}
                                            </TableCell>
                                            :
                                            <></>
                                        )}
                                    </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Compare;