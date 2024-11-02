import React, { useState, useEffect } from 'react';
import Tracking from './components/Tracking';
import './css/App.css';
import Button from './components/Button';
import CarSwitcher from './components/CarSwitcher';
import { carData, CarData } from './components/CarDetails';
import ZoomInOut from './components/ZoomInOut';

const App: React.FC = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [background, setBackground] = useState(carData[0].backgroundGradient);

  const updateBackground = (newBackground: string) => {
    setBackground(newBackground);
  };

  const buttonZones = {
    plus: { left: 200, top: 90, right: 600, bottom: 100 },
    minus: { left: 100, top: 90, right: 200, bottom: 250 },
    prevCar: { left: 400, top: 350, right: 500, bottom: 550 },
    nextCar: { left: 100, top: 350, right: 200, bottom: 550 },
    left: { left: 400, top: 150, right: 500, bottom: 250 },
    right: { left: 600, top: 150, right: 700, bottom: 250 }
};

  const handleHandOverButton = (buttonId: string) => {
    if (hoveredButton !== buttonId) {
      setHoveredButton(buttonId);
      setHoverStartTime(Date.now());
    }
  };

  useEffect(() => {
    if (hoveredButton && hoverStartTime) {
      const interval = setInterval(() => {
        const hoverDuration = Date.now() - hoverStartTime;
        if (hoverDuration >= 2000) {
          setHoveredButton(null);
          setHoverStartTime(null);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [hoveredButton, hoverStartTime]);

  const handleZoomChange = (newZoomLevel: number) => {
    setZoomLevel(newZoomLevel);
  };

  return (
    <div
        className="App"
        style={{
          background: background,
          transition: 'background 0.5s ease',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
    >
      <div className="frame-container">
        <div className="main-content">
          <CarSwitcher
            carData={carData}
            zoomLevel={zoomLevel}
            buttonId={hoveredButton}
            updateBackground={updateBackground} 
          />
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
