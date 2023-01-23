//TODO - nie wyszukiwać bez pogody

import React, { useState } from "react"
import { Button } from "@mui/material"
import Gamemode from "./Gamemode"
import Compare from "./Compare"
import Search from "./Search"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { PlacesContext } from "./PlacesContext"
import { Errors } from "./ErrorContext"
import SnackBar from "./SnackBar"

const App = () => {
    const [places, setPlaces] = useState([]);
    const [timeSpan, setTimeSpan] = useState([0, 11]);
    /*const buttonOnClick = async () => {
        const data = await fetchApi(
            "searchForWeather",
            {
                ids: [1, 2],
                left: 0,
                right: 11
            }
        )
        console.log(data)
    }*/

    return (
        <div>
            <Errors>
                <>
                    <PlacesContext.Provider value = {{places, setPlaces, timeSpan, setTimeSpan}}>
                        <BrowserRouter>
                            <Routes>
                                <Route path = "/" element = {<Navigate to = "/search"/>} />
                                <Route path = "/compare" element = {<Compare/>} />
                                <Route path = "/search" element = {<Search/>} />
                            </Routes>
                        </BrowserRouter>
                        {/*<Button onClick={buttonOnClick}>
                            click to query
                        </Button>*/}
                    </PlacesContext.Provider>
                    {<SnackBar/>}
                </>
            </Errors>
        </div>
    )
}

export default App
