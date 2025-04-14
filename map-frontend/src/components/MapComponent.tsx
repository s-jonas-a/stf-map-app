import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './styles/map.css';
import PositionMarker from './PositionMarker';
import { initializeMap, loadStfCabins, loadUserMessages } from './helpers/mapHelpers.ts';

const MapComponent = () => {

    const [map, setMap] = useState<maptilersdk.Map | null>(null);

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map_position, setMapPosition] = useState({ lng: 14.63566, lat: 63.1792 });
    maptilersdk.config.apiKey = 'vbB953Cyb8j2l29wwOCy';


    useEffect(() => {

        if (map) return; // Only initialize map once
        const initialize = async () => {

            console.log('initializeMap Map container:', mapContainer.current);
            const mapInstance = initializeMap(mapContainer.current, map_position);

            mapInstance.on('load', async () => {
                await loadStfCabins(mapInstance);
                await loadUserMessages(mapInstance);

                setMap(mapInstance);
            });
        };

        initialize();
    }, [map_position]);

    // Set up an interval to periodically fetch new data and update the map
    setInterval(loadUserMessages, 60000); // Update every 60 seconds

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
            {map && <PositionMarker map={map} />}
        </div>
    );


};

export default MapComponent;
