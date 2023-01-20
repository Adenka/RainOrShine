import React, { useContext, useEffect, useState } from "react";
import { TileLayer, MapContainer, useMap, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Paper, Autocomplete, TextField, Button, Collapse, Slider, Typography, IconButton, FormControlLabel, Checkbox } from "@mui/material";
import { useNavigate } from "react-router";
import L from 'leaflet';
import { weatherFeaturesDefaultValues } from "../assets/weatherFeaturesDefaultValues"
import { weatherFeatures } from "../assets/weatherFeatures";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { PlacesContext } from "./PlacesContext";
import { useFetchApi } from "../utils/apiMiddleware";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const CompareButton = ({markers}) => {
    const {setPlaces} = useContext(PlacesContext);
    const navigate = useNavigate();

    const handleOnClick = () => {
        setPlaces(markers.map((marker) => (marker["id"])));
        navigate("/compare");
    }

    return <Button
        variant = "contained"
        onClick = {handleOnClick}
        sx = {{
            position: "fixed",
            right: 20,
            bottom: 30,
            fontSize: 16,
            padding: 2,
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
    const navigate = useNavigate();
    const { places, setPlaces, timeSpan, setTimeSpan } = useContext(PlacesContext);
    const [ markers, setMarkers ] = useState([]);
    const [ center, setCenter ] = useState({ lat: 53, lng: 19 })
    const [ zoom, setZoom ] = useState(9);
    const fetchApi = useFetchApi();

    const getStartingCoordinates = async () => {
        const startingCoordinates = await fetchApi(
            "searchForCoordinates",
            {
                ids: places
            }
        )
        console.log(startingCoordinates)
        return startingCoordinates
    }

    const fetchStartingCoordinates = async () => {
        const startingCoordinates = await getStartingCoordinates();

        console.log(startingCoordinates)

        setMarkers(startingCoordinates.map(place => ({
            id: place["ID_PLACE"],
            position: [place["LATITUDE"], place["LONGITUDE"]]
        })))

        const sumLatitude = startingCoordinates.reduce((acc, obj) => acc + obj["LATITUDE"], 0);
        const sumLongitude = startingCoordinates.reduce((acc, obj) => acc + obj["LONGITUDE"], 0);
        const howMany = startingCoordinates.length;

        if (howMany > 0) {
            setCenter({lat: sumLatitude / howMany, lng: sumLongitude / howMany});
        }
    }
    
    useEffect(() => {
        console.log(places);
        
        fetchStartingCoordinates();
    }, [])

    const [autocompleteValueId, setAutocompleteValueId] = useState(-1);
    const [autocompleteValue, setAutocompleteValue] = useState(null);
    const [distanceValue, setDistanceValue] = useState(50);
    const [inputValue, setInputValue] = useState('');
    const [weatherFeaturesShown, setWeatherFeaturesShown] = useState(false);
    const [weatherConstraints, setWeatherConstraints] = useState(weatherFeaturesDefaultValues)

    const getLocalization = async (id) => {
        console.log(id);
        const newRow = await fetchApi(
            "searchForCoordinates",
            {
                ids: [id],
            }
        )
        
        console.log(newRow)
        return {
            placeId: newRow[0]["ID_PLACE"],
            placeName: newRow[0]["PLACE_NAME"],
            latitude: newRow[0]["LATITUDE"],
            longitude: newRow[0]["LONGITUDE"],
        }
    }

    const handleAutocompleteValueChange = async (event, newValue) => {
        if (!newValue) {
            setAutocompleteValueId(-1);
            setAutocompleteValue(newValue);
            return;
        }

        setAutocompleteValueId(newValue["id"]);
        setAutocompleteValue(newValue["label"]);
        
        const obj = await getLocalization(newValue["id"]);
        console.log(obj);
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

    const getLocalizations = async () => {
        let centerMarker = null
        if (autocompleteValue) {
            centerMarker = markers.find(marker => marker["id"] === autocompleteValueId)    
        }
        console.log(centerMarker);
        console.log(autocompleteValue);
        console.log(autocompleteValueId);

        const whatToShow = (weatherFeature) => {
            return  !isDisabled[weatherFeature]
                    ? weatherConstraints[weatherFeature]["defaultValue"] : [-1000, 1000];
        }
        
        console.log(centerMarker)
        const newLocalizations = await fetchApi(
            "searchConstraints",
            {
                left: timeSpan[0], right: timeSpan[1],
                tempMax:    whatToShow("Record high"),
                tempAvgMax: whatToShow("Average high"),
                tempAvg:    whatToShow("Daily mean"),
                tempAvgMin: whatToShow("Average low"),
                tempMin:    whatToShow("Record low"),
                avgRain:    whatToShow("Average precipitation"),
                avgRainDays: whatToShow("Average precipitation days"),
                avgSunHours: whatToShow("Mean monthly sunshine hours"),
                center: ((centerMarker) ? centerMarker["position"] : [0, 0]),
                radius: ((centerMarker) ? (distanceValue) : 1000000)
            }
        )
        
        console.log(newLocalizations)
        return newLocalizations
    }

    const searchButtonClicked = async () => {
        const newLocalizations = await getLocalizations();
        console.log(newLocalizations);
        const newMarkers = newLocalizations.map(newLocalization => ({
            id: newLocalization["ID_PLACE"],
            position: [newLocalization["LATITUDE"], newLocalization["LONGITUDE"]]
        }))
        console.log(newMarkers)
        setMarkers(newMarkers)
    }

    const deleteFromMarkers = (marker) => {
        console.log(marker)
        setMarkers(prevMarkers =>
            prevMarkers.filter((m, _) => m["id"] !== marker["id"]))
    }

    const [options, setOptions] = useState([]);

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

    const handleClickedMarker = async (marker) => {
        const obj = await getLocalization(marker["id"]);
        console.log(obj)
        const latitude = obj["latitude"];
        const longitude = obj["longitude"];

        setCenter({lat: latitude, lng: longitude});
        setAutocompleteValueId(obj["placeId"]);
        setAutocompleteValue(obj["placeName"]);
    }

    const getOptions = async () => {
        const prefix = inputValue;
        const newOptions = await fetchApi(
            "searchAllCitiesLikePrefix",
            {
                prefix: prefix
            }
        )
        setOptions(newOptions)
    }

    React.useEffect(() => {
        getOptions()
    }, [autocompleteValue, inputValue])

    const handleSliderMoved = (k, v) => {
        console.log(k, v)
        setWeatherConstraints(prevWeatherConstraints => ({
            ...prevWeatherConstraints,
            [k]: {
                ...prevWeatherConstraints[k],
                defaultValue: v,
            }
        }))
    }

    return (
        <div style = {{height: "100%", width: "100%", position: "fixed"}}>
            <CompareButton markers = {markers}/>
            <div style = {{
                position: "fixed", left: 72, top: 16, zIndex: 700
            }}>
                <Paper style = {{width: 500, backgroundColor: "white", padding: 25}}>
                    <Autocomplete
                        renderInput={(params) => (<TextField {...params} label = "Add a location"/>)}
                        options = {options.map(
                            option => ({id: option["ID_PLACE"], label: option["PLACE_NAME"]})
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
                            {Object.entries(weatherConstraints).map(([k, v], key) => (
                                <div key = {key}>
                                    <Typography>
                                        <FormControlLabel sx = {{height: 35}}
                                            control = {
                                                <Checkbox
                                                    checked = {!isDisabled[k]}
                                                    onChange = {() => handleCheckClicked(k)}
                                                />
                                            }
                                        />
                                        {k}
                                    </Typography>
                                    <Slider
                                        defaultValue = {v.defaultValue}
                                        valueLabelDisplay = "auto"
                                        step = {v.step}
                                        min = {v.min}
                                        max = {v.max}
                                        disabled = {isDisabled[k]}
                                        onChangeCommitted = {(_, newValue) => handleSliderMoved(k, newValue)}
                                    />
                                </div>
                            ))}
                        </div>
                    </Collapse>
                    <div style = {{width: "100%", display: "flex", justifyContent: "right", marginTop: 20}}>
                        <Button onClick = {searchButtonClicked}>
                            Search!
                        </Button>
                    </div>
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
                    <Marker position = {marker["position"]} eventHandlers={{
                        click: (e) => handleClickedMarker(marker),
                      }}>
                        <Popup>
                            <div style = {{display: "flex", flexDirection: "column"}}>
                            <Button
                                variant = "contained"
                                onClick={() => {setPlaces([marker.id]); navigate("/compare")}}
                            >
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