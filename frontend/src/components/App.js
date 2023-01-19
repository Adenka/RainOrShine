import React, { useState } from "react"
import { Button } from "@mui/material"
import { fetchApi } from "../utils/apiMiddleware"
import Gamemode from "./Gamemode"
import Compare from "./Compare"
import Search from "./Search"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { PlacesContext } from "./PlacesContext"

const App = () => {
    const [places, setPlaces] = useState([]);

    const buttonOnClick = async () => {
        const data = await fetchApi(
            "searchForWeather",
            {
                ids: [1, 2],
                left: 0,
                right: 11
            }
        )
        console.log(data.rows)
    }

    return (
        <div>
            <PlacesContext.Provider value = {{places, setPlaces}}>
                <BrowserRouter>
                    <Routes>
                        <Route path = "/" element = {<Gamemode/>} />
                        <Route path = "/compare" element = {<Compare/>} />
                        <Route path = "/search" element = {<Search/>} />
                    </Routes>
                </BrowserRouter>
                <Button onClick={buttonOnClick}>
                    click to query
                </Button>
            </PlacesContext.Provider>            
        </div>
    )
}

            /**/
export default App
