import React, { useEffect, useRef, useState } from "react";
import { TileLayer, MapContainer } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

const Search = () => {
    const [center, setCenter] = useState({ lat: 53, lng: 18 })
    const zoomlvl = 9;

    return (<div style = {{height: "100%", width: "100%", position: "fixed"}}>
            <MapContainer
                style={{height: "calc(100vh - 16px)", width: "calc(100vw - 16px)"}}
                center = {center}
                zoom = {zoomlvl}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
            </MapContainer>
    </div>)
}

export default Search;