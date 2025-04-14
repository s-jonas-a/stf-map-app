import * as maptilersdk from '@maptiler/sdk';

export const initializeMap = (mapContainer, map_position) => {

    const startZoom = 7;
    const map = new maptilersdk.Map({
        container: mapContainer.current,
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

export const loadImageAndGeoJSON = async (map) => {
    try {
        let response = await fetch('./stf-icon.png');
        const blob = await response.blob();
        const imageBitmap = await createImageBitmap(blob);
        map.addImage('stf_image', imageBitmap);

        response = await fetch('./stfPlaces.geojson');
        const geojson = await response.json();

        map.addSource('stf_locations', {
            type: 'geojson',
            data: geojson
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
    
        map.on('mouseenter', 'sft_layer', (e) => {
            map.getCanvas().style.cursor = 'pointer';
            const coordinates = e.features[0].geometry.coordinates.slice();
            const name = e.features[0].properties.name;
            popup.setLngLat(coordinates).setHTML(`<strong>${name}</strong>`).addTo(map);
        });
    
        map.on('mouseleave', 'sft_layer', () => {
            map.getCanvas().style.cursor = '';
            popup.remove();
        });

    } catch (error) {
        console.error("Error loading image or GeoJSON:", error);
    }
};