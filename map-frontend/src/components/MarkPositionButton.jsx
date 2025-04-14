import React, { useState } from 'react';
import axios from 'axios';
import * as maptilersdk from '@maptiler/sdk';
import "@maptiler/sdk/dist/maptiler-sdk.css";
import './styles/textBox.css'; // Import the CSS file


export default function MarkPositionButton({ map }) {

    const [marker, setMarker] = useState(null);
    const [buttonText, setButtonText] = useState('Insert position marker');

    const handleClick = () => {

        if (marker) {
            marker.remove();
            setMarker(null);
            setButtonText('Insert position marker');
        } else {

            const newMarker = new maptilersdk.Marker({
                draggable: true,
            })
                .setLngLat(map.current.getCenter())
                .setPopup(new maptilersdk.Popup({
                    closeButton: false,
                    closeOnClick: false
                })
                    .setText("Drag the marker to the wanted position\n" + "and add comments and pictures."))
                .addTo(map.current);


            newMarker.togglePopup();
            newMarker.on('dragend', () => {
                showTextBox(map.current, newMarker);
            });

            setMarker(newMarker);
            setButtonText('Remove position marker');
        }
    };

    const showTextBox = (map, marker) => {
        marker.setDraggable(false);
        const textBox = document.createElement('div');
        textBox.className = 'text-box'; // Apply the CSS class
        textBox.innerHTML = `
                <textarea id="userText" rows="20" cols="40" placeholder="Insert text here"></textarea>
                <div class="button-container">
                    <button id="cancelText">Cancel</button>
                    <button id="addPics">Add Picures...</button>
                    <button id="submitText">Submit</button>
                </div>
        `;
        textBox.style.left = `${marker.getLngLat().lng}px`;
        textBox.style.top = `${marker.getLngLat().lat}px`;

        document.body.appendChild(textBox);

        document.getElementById('cancelText').addEventListener('click', () => {
            console.log('User canceled text:');
            marker.setDraggable(true);;
            document.body.removeChild(textBox);
        });

        document.getElementById('addPics').addEventListener('click', () => {
            console.log('User wants to add pictures:');
            // Implement your logic for adding pictures here
            marker.setDraggable(true);
            document.body.removeChild(textBox);
        });

        document.getElementById('submitText').addEventListener('click', async () => {
            const userText = document.getElementById('userText').value;
            console.log('User submitted text:', userText, "Position", marker.getLngLat());
            submitUserMessage(userText, marker.getLngLat().lng, marker.getLngLat().lat);
            // await axios.post('http://localhost:8080/api/message', { message: userText, observationLng: marker.getLngLat().lng, observationLat: marker.getLngLat().lat });

            marker.setDraggable(true);
            document.body.removeChild(textBox);
            marker.remove();
            setMarker(null);
            setButtonText('Insert position marker');
        });
    };

    return (
        <button onClick={handleClick} className="mark-position-button">{buttonText}</button>
    );



}
// Function to submit user message
const submitUserMessage = async (message, lng, lat) => {
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
