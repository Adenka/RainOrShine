import React, { useState } from "react";
import { Checkbox, FormControlLabel, FormGroup, TableContainer, Table, TableCell, TableRow, TableHead, TableBody, IconButton, Autocomplete, TextField, Button } from "@mui/material"
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from "react-router-dom";

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

    React.useEffect(() => {
        // query
    }, [value, inputValue])

    console.log(value)

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
                            <TableHead>
                                <TableRow>
                                    <TableCell>
                                        Name
                                    </TableCell>
                                    {weatherFeatures.map(weatherFeature => (
                                        (isShown[weatherFeature])
                                        ?
                                        <TableCell>
                                            {weatherFeature}
                                        </TableCell>
                                        :
                                        <></>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {data.map((entry, index) =>
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
                                    </TableRow>    
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </div>
    );
}

export default Compare;