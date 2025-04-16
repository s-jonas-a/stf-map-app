import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as maptilersdk from '@maptiler/sdk';
import { Map, Marker } from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './styles/textBox.css'; // Import the CSS file
import './styles/map.css'; // Import the CSS file
import { loadUserMessages } from './helpers/mapHelpers.ts';

interface PositionMarkerProps {
    map: Readonly<Map>;
}

const PositionMarker: React.FC<PositionMarkerProps> = ({ map }) => {

    const [marker, setMarker] = useState<Marker | null>(null);
    const [buttonText, setButtonText] = useState('Insert position marker');

    const handleClick = () => {

        if (marker) {
            marker.remove();
            setMarker(null);
            setButtonText('Insert position marker');
        } else {

            const newMarker = new Marker({
                draggable: true,
            })
                .setLngLat(map?.getCenter())
                .setPopup(new maptilersdk.Popup({
                    closeButton: false,
                    closeOnClick: false
                })
                    .setText("Drag the marker to the wanted position\n" + "and add comments and pictures."))
                .addTo(map);

            newMarker.getElement().style.display = 'run-in';
            newMarker.togglePopup();
            newMarker.on('dragend', () => {
                showUserMessageInput(newMarker, map);
            });
            setMarker(newMarker);
            setButtonText('Remove position marker');
        }
    };

    return (
        <button onClick={handleClick} className="mark-position-button">{buttonText}</button>
    );
};

function showUserMessageInput(marker: Marker, map: Readonly<Map>): void {
    const textBox = document.createElement('div');
    textBox.className = 'text-box'; // Apply the CSS class
    textBox.innerHTML = `
                <textarea id="userText" rows="20" cols="40" placeholder="Insert text here"></textarea>
                <div class="button-container">
                    <button id="cancelText" class="cancel-button">Cancel</button>
                    <button id="addPics" class="add-pics-button">Add Pictures...</button>
                    <button id="submitText" class="submit-button">Submit</button>
                </div>
        `;
    textBox.style.left = `${marker.getLngLat().lng}px`;
    textBox.style.top = `${marker.getLngLat().lat}px`;

    document.body.appendChild(textBox);

    marker.togglePopup();
    marker.setDraggable(false);

    document.getElementById('cancelText')?.addEventListener('click', () => {
        marker.togglePopup();
        marker.setDraggable(true);
        document.body.removeChild(textBox);
    });

    document.getElementById('addPics')?.addEventListener('click', () => {
        console.log('User wants to add pictures:');
        marker.togglePopup();
        marker.setDraggable(true);
        document.body.removeChild(textBox);
    });

    document.getElementById('submitText')?.addEventListener('click', async () => {
        const userText = (document.getElementById('userText') as HTMLTextAreaElement).value;
        console.log('User submitted text:', userText, "Position", marker.getLngLat());
        submitUserMessage(userText, marker.getLngLat().lng, marker.getLngLat().lat);
        marker.togglePopup();
        marker.setDraggable(true);
        document.body.removeChild(textBox);
        await loadUserMessages(map);
    });
};

export default PositionMarker;

// Function to submit user message
const submitUserMessage = async (message: string, lng: number, lat: number) => {
    try {
        const response = await axios.post('http://localhost:8080/api/message', {
            message: message,
            observationDate: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
            observationLng: lng,
            observationLat: lat
        });
        console.log('Message saved:', response.data);
    } catch (error) {
        console.error('Error saving message:', error);
    }
};
