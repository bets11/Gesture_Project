import React, { useState, useEffect } from 'react';
import Tracking from './components/Tracking';
import './css/App.css';
import Button from './components/Button';
import CarSwitcher from './components/CarSwitcher';
import carData from './carData.json';
import buttonZones from './buttonZones.json';
import ZoomInOut from './components/ZoomInOut';


const App: React.FC = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [background, setBackground] = useState(carData[0].backgroundGradient);
  const [actionTimeout, setActionTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateBackground = (newBackground: string) => {
    setBackground(newBackground);
  };

  const handleHandOverButton = (buttonId: string) => {
    if (hoveredButton !== buttonId) {
      setHoveredButton(buttonId);

      if (actionTimeout) clearTimeout(actionTimeout);
      const timeout = setTimeout(() => {
        setHoveredButton(buttonId); 
      }, 2000); 

      setActionTimeout(timeout);
    }
  };

  useEffect(() => {
    return () => {
      if (actionTimeout) clearTimeout(actionTimeout);
    };
  }, [hoveredButton, actionTimeout]);

  const handleZoomChange = (newZoomLevel: number) => {
    setZoomLevel(newZoomLevel);
  };

  return (
    <div className="App"
      style={{
        background: background}}>
      <div className="frame-container">
        <div className="main-content">
          <CarSwitcher
            carData={carData}
            zoomLevel={zoomLevel}
            buttonId={hoveredButton}
            updateBackground={updateBackground}
          />
          <ZoomInOut onZoomChange={handleZoomChange} buttonId={hoveredButton} />
          <Tracking onHandOverButton={handleHandOverButton} buttonZones={buttonZones} />
          <ZoomInOut onZoomChange={handleZoomChange} buttonId={hoveredButton} />
          <div className="button-columns">
            <div className="button-row">
              <Button id="plus" hovered={hoveredButton === 'plus'} onHover={setHoveredButton} />
              <Button id="minus" hovered={hoveredButton === 'minus'} onHover={setHoveredButton} />
            </div>
            <div className="button-row">
              <Button id="left" hovered={hoveredButton === 'left'} onHover={setHoveredButton} />
              <Button id="right" hovered={hoveredButton === 'right'} onHover={setHoveredButton} />
            </div>
            <div className="button-row">
              <Button id="prevCar" hovered={hoveredButton === 'prevCar'} onHover={setHoveredButton} />
              <Button id="nextCar" hovered={hoveredButton === 'nextCar'} onHover={setHoveredButton} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
