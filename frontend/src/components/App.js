import React from "react"
import { Button } from "@mui/material"
import { fetchApi } from "../utils/apiMiddleware"
import Gamemode from "./Gamemode"
import Compare from "./Compare"
import Search from "./Search"
import { BrowserRouter, Routes, Route } from "react-router-dom"

const App = () => {

    const buttonOnClick = async () => {
        const data = await fetchApi("cityId", {id: 5})
        console.log(data)
    }

    return (
        <div>
            <BrowserRouter>
                <Routes>
                    <Route path = "/" element = {<Gamemode/>} />
                    <Route path = "/compare" element = {<Compare/>} />
                    <Route path = "/search" element = {<Search/>} />
                </Routes>
            </BrowserRouter>

            {/*<Button onClick={buttonOnClick}>
                click to query
            </Button>*/}
            
        </div>
    )
}

export default App
