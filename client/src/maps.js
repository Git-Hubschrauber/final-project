import React from "react";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
const API_KEY = require("../../server/secrets.json").API_KEY;

const containerStyle = {
    width: "800px",
    height: "400px",
};

const center = {
    lat: 52.4,
    lng: 13.2,
};

function Maps() {
    return (
        <LoadScript googleMapsApiKey={API_KEY}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
            >
                {/* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        </LoadScript>
    );
}

export default React.memo(Maps);
