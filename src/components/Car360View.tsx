import React, { useState, useEffect } from 'react';
import '../css/Car360View.css';

interface Car360ViewProps {
  carImages: string[]; 
  zoomLevel: number;
  buttonId: string | null;
}

const Car360View: React.FC<Car360ViewProps> = ({ carImages, zoomLevel, buttonId }) => {
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    if (buttonId === 'left') {
      setCurrentRotation((prevRotation) => prevRotation - 90); 
    } else if (buttonId === 'right') {
      setCurrentRotation((prevRotation) => prevRotation + 90); 
    }
  }, [buttonId]);

  return (
    <div className="car-360-view">
      <div
        className="prism-container"
        style={{ transform: `rotateY(${currentRotation}deg) scale(${zoomLevel})` }}
      >
        <div className="prism-side prism-front">
          <img src={carImages[0]} alt="Front view" className="car-image" />
        </div>
        <div className="prism-side prism-right">
          <img src={carImages[1]} alt="Right view" className="car-image" />
        </div>
        <div className="prism-side prism-back">
          <img src={carImages[2]} alt="Back view" className="car-image" />
        </div>
        <div className="prism-side prism-left">
          <img src={carImages[3]} alt="Left view" className="car-image" />
        </div>
      </div>
    </div>
  );
};

export default Car360View;
