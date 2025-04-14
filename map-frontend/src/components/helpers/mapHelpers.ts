import * as maptilersdk from '@maptiler/sdk';
import axios from 'axios';
import { UserMessage } from '../UserMessage';

export type MapPosition = {
    lat: number;
    lng: number;
};

// Used local type
interface GeoJSONFeature {
    type: 'Feature';
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    properties: {
        id: number;
        message: string;
        observationDate: string;
    };
}

// Used local type
interface GeoJSON {
    type: 'FeatureCollection';
    features: GeoJSONFeature[];
}

export const initializeMap = (mapContainer: HTMLElement | null, map_position: MapPosition): maptilersdk.Map => {


    if (!mapContainer) {
        throw new Error('Map container is not defined');
    }
    const startZoom = 7;
    const map = new maptilersdk.Map({
        container: mapContainer,
        style: maptilersdk.MapStyle.OUTDOOR,
        center: [map_position.lng, map_position.lat],
        scaleControl: true,
        zoom: startZoom
    });

    const nav = new maptilersdk.MaptilerNavigationControl({
        showZoom: true,
        showCompass: false
    });
    map.addControl(nav, 'top-left');
    return map;
};

export const loadStfCabins = async (map: maptilersdk.Map): Promise<void> => {
    try {
        let iconResponse = await fetch('./stf-icon.png');
        const blob = await iconResponse.blob();
        const imageBitmap = await createImageBitmap(blob);
        map.addImage('stf_image', imageBitmap);

        const placesGetResponse = await axios.get('http://localhost:8080/stfPlaces.geojson');
        const geojsonData = placesGetResponse.data;

        map.addSource('stf_locations', {
            type: 'geojson',
            data: geojsonData
        });

        map.addLayer({
            'id': 'sft_layer',
            'type': 'symbol',
            'source': 'stf_locations',
            'layout': {
                'icon-image': 'stf_image',
                'icon-size': ['*', ['get', 'scalerank'], 0.5]
            },
            'paint': {}
        });

        const popup = new maptilersdk.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'sft_layer', (e: maptilersdk.MapMouseEvent & { features?: maptilersdk.MapGeoJSONFeature[] }) => {
            map.getCanvas().style.cursor = 'pointer';
            const name = e.features?.[0].properties.name;
            let coordinates = readCoordinates(e);
            popup.setLngLat([coordinates[0], coordinates[1]]).setHTML(`<strong>${name}</strong>`).addTo(map);
        });

        map.on('mouseleave', 'sft_layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

    } catch (error) {
        console.error("Error loading image or GeoJSON:", error);
    }
};

export const loadUserMessages = async (map: Readonly<maptilersdk.Map>): Promise<void> => {

    try {

        let iconResponse = await fetch('./red-dot-square.png');
        const blob = await iconResponse.blob();
        const imageBitmap = await createImageBitmap(blob);

        // Only load image once
        if (!map.getImage('userMessage_image')) {
            map.addImage('userMessage_image', imageBitmap);
        }

        const getResponse = await axios.get('http://localhost:8080/api/message');
        const jsonData = getResponse.data;
        // Convert the json data (UserMessage) to workable geojson data for maps:
        const geoJsonData = convertToGeoJSON(jsonData);


        // Remove the existing source and layer if they exist
        if (map.getSource('userMessage_locations')) {
            map.removeLayer('userMessage_layer');
            map.removeSource('userMessage_locations');
        }

        // Add the source with the GeoJSON data
        map.addSource('userMessage_locations', {
            type: 'geojson',
            data: geoJsonData,
        });

        map.addLayer({
            'id': 'userMessage_layer',
            'type': 'symbol',
            'source': 'userMessage_locations',
            'layout': {
                'icon-image': 'userMessage_image',
                'icon-size': 0.05
            },
            'paint': {}
        });

        const popup = new maptilersdk.Popup({
            closeButton: false,
            closeOnClick: false
        });

        map.on('mouseenter', 'userMessage_layer', (e: maptilersdk.MapMouseEvent & { features?: maptilersdk.MapGeoJSONFeature[] }) => {
            map.getCanvas().style.cursor = 'pointer';
            const message = e.features?.[0].properties.message;
            const observationDate = e.features?.[0].properties.observationDate;
            let coordinates = readCoordinates(e);
            popup.setLngLat([coordinates[0], coordinates[1]]).setHTML(`<strong>${observationDate}</strong><br>${message}`).addTo(map);
        });

        map.on('mouseleave', 'userMessage_layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });


    } catch (error) {
        console.error('Error saving message:', error);
    }
}

const readCoordinates = (e: maptilersdk.MapMouseEvent & { features?: maptilersdk.MapGeoJSONFeature[] }): number[] => {
    // Holy smoke.... This is a quite extent detour to get the coordinates of the a feature!
    const feature = e.features?.[0];
    if (feature) {
        switch (feature.geometry.type) {
            case 'Point':
                return (feature.geometry).coordinates.slice();;
            // Don't care about the other types of geometry for now....
            // case 'LineString':
            //     const lineCoordinates = (feature.geometry as GeoJSON.LineString).coordinates.slice();
            //     console.error('Feature does not exist or does not have geometry we support');
            //     return [0, 0];
            // case 'Polygon':
            //     const polygonCoordinates = (feature.geometry as GeoJSON.Polygon).coordinates.slice();
            //     console.error('Feature does not exist or does not have geometry we support');
            //     return [0, 0];
            default:
                console.error('Feature does not exist or does not have geometry we support');
                return [0, 0];
        }
    } else {
        console.error('Feature does not exist or does not have geometry we support');
        return [0, 0];
    }
};

const convertToGeoJSON = (messages: UserMessage[]): GeoJSON => {
    const features: GeoJSONFeature[] = messages.map((message) => ({
        type: 'Feature', // Explicitly set the type to "Feature"
        geometry: {
            type: 'Point',
            coordinates: [message.observationLng, message.observationLat],
        },
        properties: {
            id: message.id,
            message: message.message,
            observationDate: message.observationDate,
        },
    }));

    return {
        type: 'FeatureCollection',
        features,
    };
};

