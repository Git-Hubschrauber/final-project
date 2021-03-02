import React from "react";
import { useState, useCallback } from "react";

import {
    GoogleMap,
    InfoWindow,
    useLoadScript,
    LoadScript,
    Marker,
} from "@react-google-maps/api";

import usePlacesAutocomplete, {
    getGeocode,
    getLatLng,
} from "use-places-autocomplete";
import useOnclickOutside from "react-cool-onclickoutside";

import {
    Combobox,
    ComboboxInput,
    ComboboxPopover,
    ComboboxList,
    ComboboxOption,
    ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const API_KEY = require("../../server/secrets.json").API_KEY;

const containerStyle = {
    width: "800px",
    height: "400px",
};

let center = {
    lat: 52.5,
    lng: 13.4,
};

const libraries = ["places"];

export default function Maps() {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: API_KEY,
        libraries,
    });

    const [markers, setMarkers] = useState([]);
    const [selected, setSelected] = useState(null);

    const onMapClick = useCallback((event) => {
        console.log("gmap e: ", event);
        setMarkers((current) => [
            ...current,
            {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
                time: new Date(),
            },
        ]);
    }, []);

    const mapRef = React.useRef();
    const onMapLoad = React.useCallback((map) => {
        mapRef.current = map;
    }, []);

    const panTo = React.useCallback(({ lat, lng }) => {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(14);
    }, []);

    if (loadError) return "Error loading map";
    if (!isLoaded) return "Loading map";

    return (
        <div>
            <Search panTo={panTo} />

            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onClick={onMapClick}
            >
                {markers.map((marker) => (
                    <Marker
                        key={`${marker.lat}-${marker.lng}`}
                        position={{ lat: marker.lat, lng: marker.lng }}
                        onClick={() => {
                            setSelected(marker);
                        }}
                    />
                ))}
                {selected ? (
                    <InfoWindow
                        position={{
                            lat: selected.lat,
                            lng: selected.lng,
                        }}
                        onCloseClick={() => {
                            setSelected(null);
                        }}
                    >
                        <div>
                            <h1>Hello, it worked!!!!</h1>
                        </div>
                    </InfoWindow>
                ) : null}
                {/* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        </div>
    );
}

function Search({ panTo }) {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            location: { lat: () => 52.5, lng: () => 13.4 },
            radius: 100 * 1000,
        },
    });

    return (
        <div className="search">
            <Combobox
                onSelect={async (address) => {
                    console.log(address);
                    setValue(address, false);
                    clearSuggestions();
                    try {
                        const results = await getGeocode({ address });
                        const { lat, lng } = await getLatLng(results[0]);
                        console.log(lat, lng);
                        panTo = { lat, lng };
                    } catch (error) {
                        console.log(error);
                    }
                }}
            >
                <ComboboxInput
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                    }}
                    disabled={!ready}
                    placeholder="What do you search?"
                />
                <ComboboxPopover>
                    <ComboboxList>
                        {status === "OK" &&
                            data.map(({ index, description }) => (
                                <ComboboxOption
                                    key={description.toString()}
                                    value={description}
                                />
                            ))}
                    </ComboboxList>
                </ComboboxPopover>
            </Combobox>
        </div>
    );
}
