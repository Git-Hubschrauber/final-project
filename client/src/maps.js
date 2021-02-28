import React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
const API_KEY = require("../../server/secrets.json").API_KEY;

const containerStyle = {
    width: "600px",
    height: "600px",
};

const center = {
    lat: 52.745,
    lng: 13.523,
};

const libraries = ["places"];

function Maps() {
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: API_KEY,
        libraries,
    });

    const options = {
        disableDefaultUi: true,
        zoomControl: true,
    };
    const [map, setMap] = React.useState(null);

    const onLoad = React.useCallback(function callback(map) {
        const bounds = new window.google.maps.LatLngBounds();
        map.fitBounds(bounds);
        setMap(map);
    }, []);

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={options}
        >
            {/* Child components, such as markers, info windows, etc. */}
            <></>
        </GoogleMap>
    ) : (
        <>Error</>
    );
}

export default React.memo(Maps);
