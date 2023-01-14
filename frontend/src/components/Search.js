import React, { useState } from "react";
import { TileLayer, MapContainer, useMap, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Paper, Autocomplete, TextField, Button, Collapse, Slider, Typography, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import { useNavigate } from "react-router";
import L from 'leaflet';
import { weatherFeaturesDefaultValues } from "../assets/weatherFeaturesDefaultValues"
import { weatherFeatures } from "../assets/weatherFeatures";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const CompareButton = () => {
    const navigate = useNavigate();

    return <Button
        variant = "contained"
        onClick = {() => navigate("/compare")}
        sx = {{
            position: "fixed",
            right: 20,
            bottom: 30,
            zIndex: 1000
        }}
    >
        Compare in detail!
    </Button>
}

const ChangeView = ({center, zoom}) => {
    const map = useMap();
    map.setView(center, zoom);

    return null;
}

const Search = () => {
    const [center, setCenter] = useState({ lat: 53, lng: 19 })
    const zoom = 9;

    const [autocompleteValue, setAutocompleteValue] = useState(null);
    const [distanceValue, setDistanceValue] = useState(50);
    const [inputValue, setInputValue] = useState('');
    const [weatherFeaturesShown, setWeatherFeaturesShown] = useState(false);

    const [markers, setMarkers] = useState([]);

    const handleAutocompleteValueChange = (event, newValue) => {
        if (!newValue) {
            return;
        }

        setAutocompleteValue(newValue["label"]);
        
        const obj = data.find(elem => elem.placeId === newValue["id"]);
        const latitude = obj["latitude"];
        const longitude = obj["longitude"];
        
        console.log(newValue, latitude, longitude)

        const isThere = markers.some(marker => marker["id"] === newValue["id"])

        setCenter({lat: latitude, lng: longitude})
        console.log(obj)
        if (!isThere) {
            setMarkers(prevMarkers => [
                ...prevMarkers,
                {id: newValue["id"], position: [latitude, longitude]}
            ])
        }
    }

    const deleteFromMarkers = (marker) => {
        console.log(marker)
        setMarkers(prevMarkers =>
            prevMarkers.filter((m, _) => m["id"] !== marker["id"]))
    }

    const data = [
        {
            placeId: 2137,
            placeName: "Toruń",
            latitude: 53,
            longitude: 18.6
        },
        {
            placeId: 69,
            placeName: "Poznań",
            latitude: 52.4,
            longitude: 16.93
        },
        {
            placeId: 420,
            placeName: "Bydgoszcz",
            latitude: 53.12,
            longitude: 18
        }
    ]

    const [options, setOptions] = useState(
        data.map(place => ({placeId: place["placeId"], placeName: place["placeName"]}))
    );

    const [isDisabled, setIsDisabled] = useState({
        "Record high":  false,
        "Average high": false,
        "Daily mean":   false,
        "Average low":  false,
        "Record low":   false,
        "Average precipitation":        false,
        "Average precipitation days":   false,
        "Mean monthly sunshine hours":  false
    })

    const handleCheckClicked = (weatherFeature) => {
        setIsDisabled(prevIsDisabled => ({
            ...prevIsDisabled,
            [weatherFeature]: !prevIsDisabled[weatherFeature]
        }))
    }

    return (
        <div style = {{height: "100%", width: "100%", position: "fixed"}}>
            <CompareButton/>
            <div style = {{
                position: "fixed", left: 72, top: 16, zIndex: 700
            }}>
                <Paper style = {{width: 500, backgroundColor: "white", padding: 25}}>
                    <Autocomplete
                        renderInput={(params) => (<TextField {...params} label = "Add a location"/>)}
                        options = {options.map(
                            option => ({id: option["placeId"], label: option["placeName"]})
                        )}
                        value = {autocompleteValue}
                        onChange = {(event, newValue) => handleAutocompleteValueChange(event, newValue)}
                        onInputChange = {(event, newInputValue) => {
                            setInputValue(newInputValue)
                        }}
                        fullWidth
                    />
                    <Collapse in = {autocompleteValue}>
                        <Slider
                            defaultValue = {50}
                            valueLabelDisplay = "auto"
                            step = {50}
                            marks
                            min = {0}
                            max = {1000}
                            onChangeCommitted = {(_, newValue) => setDistanceValue(newValue)}
                        />
                    </Collapse>
                </Paper>
                <Paper style = {{marginTop: 20, padding: 25}}>
                    <div style = {{display: "flex"}}>
                        <Typography variant = "h6" style = {{flexGrow: 1}}>Weather features</Typography>
                        <IconButton
                            sx = {{height: 32, width: 32, marginRight: "6px"}}
                            onClick = {() =>
                                setWeatherFeaturesShown(prevWeatherFeaturesShown => !prevWeatherFeaturesShown)
                            }>
                            {weatherFeaturesShown ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                        </IconButton>
                    </div>
                    <Collapse in = {weatherFeaturesShown}>
                        <div style = {{marginTop: 20}}>
                            {weatherFeaturesDefaultValues.map((obj, key) => (
                                <div key = {key}>
                                    <Typography>
                                        <FormControlLabel sx = {{height: 35}}
                                            control = {
                                                <Checkbox
                                                    checked = {!isDisabled[obj.name]}
                                                    onChange = {() => handleCheckClicked(obj.name)}
                                                />
                                            }
                                        />
                                        {obj.name}
                                    </Typography>
                                    <Slider
                                        defaultValue = {obj.defaultValue}
                                        valueLabelDisplay = "auto"
                                        step = {obj.step}
                                        min = {obj.min}
                                        max = {obj.max}
                                        disabled = {isDisabled[obj.name]}
                                    />
                                </div>
                            ))}
                        </div>
                    </Collapse>
                </Paper>
            </div>
            <MapContainer
                style={{height: "calc(100vh - 16px)", width: "calc(100vw - 16px)"}}
                center = {center}
                zoom = {zoom}
            >
                <ChangeView center = {center} zoom = {zoom}/>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map(marker => (
                    <Marker position={marker["position"]}>
                        <Popup>
                            <div style = {{display: "flex", flexDirection: "column"}}>
                            <Button variant = "contained">
                                Show details
                            </Button>
                            <Button onClick={() => deleteFromMarkers(marker)}>
                                Delete
                            </Button>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>)
}

export default Search;