import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './styles/map.css';
import MarkPositionButton from './MarkPositionButton';
import PositionMarker from './PositionMarker';
import { initializeMap, loadImageAndGeoJSON } from './helpers/mapHelpers';



export default function Map() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [map_position, setMapPosition] = useState({ lng: 14.63566, lat: 63.1792 });
    maptilersdk.config.apiKey = 'vbB953Cyb8j2l29wwOCy';

    useEffect(() => {

        if (map.current) return; // initialize map only once

        map.current = initializeMap(mapContainer, map_position);

        map.current.on('load', async function () {
            await loadImageAndGeoJSON(map.current);
        });
    }, []);

    // Update map center when mapPosition state changes
    useEffect(() => {
        if (map.current) {
            console.log("useEffect() on map_position.... ", map_position.lng, map_position.lat, " Maps centre:" + map.current.getCenter());
            map.current.setCenter([map_position.lng, map_position.lat]);
        }
    }, [map_position]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
            {/* <button onClick={() => setZoom(zoom + 0.2)}>Increase Zoom</button> */}
            {/* <MarkPositionButton map={map} /> */}
            <PositionMarker map={map} />
        </div>
    );
}
