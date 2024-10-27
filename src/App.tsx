import React, { useState } from 'react';
import Tracking from './components/Tracking';
import './css/App.css';
import m4 from './pictures/m4.png';
import competition from './pictures/competition.png';
import gt63 from './pictures/gt63.png';
import Button from './components/Button';
import CarSwitcher from './components/CarSwitcher';

const App: React.FC = () => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentImage, setCurrentImage] = useState(0);

  const buttonZones = {
    plus: {left: 200, top: 90, right: 600, bottom: 100},
    minus: {left: 100, top: 90, right: 200, bottom: 250},
    prevCar: {left: 400, top: 350, right: 500, bottom: 550},
    nextCar: {left: 100, top: 350, right: 200, bottom: 550}
  };

  const carImages = [gt63, competition, m4];
  const carTitles = ["Mercedes gt63", "M4 Competition", "M4"];

  const performAction = (buttonId: string) => {
    switch (buttonId) {
      case 'plus':
        setZoomLevel(prev => Math.min(prev + 0.1, 2));
        break;
      case 'minus':
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
        break;
      case 'prevCar':
        setCurrentImage((prev) => (prev - 1 + carImages.length) % carImages.length);
        break;
      case 'nextCar':
        setCurrentImage((prev) => (prev + 1) % carImages.length);
        break;
      default:
        break;
    }
  };

  const handleHandOverButton = (buttonId: string) => {
    performAction(buttonId);
  };

  const handleButtonHover = (id: string) => {
    performAction(id);
  };

  return (
    <div className="App">
      <div className="camera-container" style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}>
        <Tracking onHandOverButton={handleHandOverButton} buttonZones={buttonZones} />
        <div className="overlay">
          <div className="button-columns">
            <div className="button-row">
              <Button id="plus" onHover={handleButtonHover} />
              <Button id="minus" onHover={handleButtonHover} />
            </div>
            <div className="button-row">
              <Button id="left" onHover={handleButtonHover} />
              <Button id="right" onHover={handleButtonHover} />
            </div>
            <div className="button-row">
              <Button id="prevCar" onHover={handleButtonHover} />
              <Button id="nextCar" onHover={handleButtonHover} />
            </div>
          </div>
          <CarSwitcher
            currentImage={currentImage}
            carImages={carImages}
            carTitles={carTitles}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
