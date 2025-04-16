import React, { useRef, useEffect, useState } from 'react';
import * as maptilersdk from '@maptiler/sdk';
import { Map } from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './styles/map.css';
import PositionMarker from './PositionMarker';
import { initializeMap, loadStfCabins, loadUserMessages, loadMapApiKey } from './helpers/mapHelpers.ts';

const MapComponent = () => {

    const [map, setMap] = useState<Map | null>(null);

    const mapContainer = useRef<HTMLDivElement | null>(null);
    const [map_position, setMapPosition] = useState({ lng: 14.63566, lat: 63.1792 });

    
    useEffect(() => {

        if (map) return; // Only initialize map once
        const initialize = async () => {

            const key = await loadMapApiKey();
            console.log('Map API Key:', key);
            maptilersdk.config.apiKey = key;

            console.log('initializeMap Map container:', mapContainer.current);
            const mapInstance = initializeMap(mapContainer.current, map_position);

            mapInstance.on('load', async () => {


                const loadUserMessagesPromise = loadStfCabins(mapInstance);
                const loadUserDataPromise = loadUserMessages(mapInstance);

                Promise.all([loadUserMessagesPromise, loadUserDataPromise])
                    .then(() => {
                        console.log('Cabins and User messages loaded successfully');
                    })
                    .catch((error) => {
                        console.error('Error loading Cabins and user messages:', error);
                    });   


                // await loadStfCabins(mapInstance);
                // await loadUserMessages(mapInstance);

                setMap(mapInstance);
            });
            // Set up an interval to periodically fetch new data and update the map
            setInterval(loadUserMessages, 60000, mapInstance); // Update every 60 seconds
        };

        initialize();
    }, [map_position]);

    return (
        <div className="map-wrap">
            <div ref={mapContainer} className="map" />
            {map && <PositionMarker map={map} />}
        </div>
    );


};

export default MapComponent;
