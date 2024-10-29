import React, { useState, useEffect } from 'react';
import Tracking from './components/Tracking';
import './css/App.css';
import m4 from './pictures/m4.png';
import competition from './pictures/competition.png';
import gt63 from './pictures/gt63.png';
import Button from './components/Button';
import CarSwitcher from './components/CarSwitcher';
import ZoomInOut from './components/ZoomInOut';


const App: React.FC = () => {
  const [hoveredButton, setHoveredButton] = useState<string | null>(null);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const buttonZones = {
    plus: { left: 200, top: 90, right: 600, bottom: 100 },
    minus: { left: 100, top: 90, right: 200, bottom: 250 },
    prevCar: { left: 400, top: 350, right: 500, bottom: 550 },
    nextCar: { left: 100, top: 350, right: 200, bottom: 550 }
  };

  const carImages = [gt63, competition, m4];
  const carTitles = ["MERCEDES BENZ GT63", "BMW M4 COMPETITION", "BMW M4 F82"];


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

  return (
    <div className="App">
        <div className="camera-container">
            <Tracking onHandOverButton={handleHandOverButton} buttonZones={buttonZones} />
            <div className="overlay">
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
              <ZoomInOut buttonId={hoveredButton} onZoomChange={setZoomLevel} />
              <CarSwitcher
            carImages={carImages}
            carTitles={carTitles}
            zoomLevel={zoomLevel}
            buttonId={hoveredButton} 
          />
          </div>
        </div>
      </div>
  );
};

export default App;
