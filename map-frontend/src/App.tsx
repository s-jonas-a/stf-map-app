import Navbar from './components/navbar.jsx';
import './App.css';
import MapComponent from './components/MapComponent.tsx';
import React from 'react';

const App = () => {
  return (
    <div className="App">
    <Navbar/>
    <MapComponent/>
    </div>
  );
}

export default App;