import React from "react";
import { useMapEvents } from "react-leaflet";

const ZoomComponent = ({setZoom, setCenter}) => {
    const mapEvents = useMapEvents({
        zoomend: () => {
            setZoom(mapEvents.getZoom());
        },
        /*moveend: () => {
            setCenter(mapEvents.getCenter());
        }*/
    });

    return null;
}

export default ZoomComponent