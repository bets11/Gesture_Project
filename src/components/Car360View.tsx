import React, { useState, useEffect } from 'react';
import Tracking from './Tracking';

interface Car360ViewProps {
  carImages: string[]; 
  zoomLevel: number;
  buttonId: string | null;
}

const Car360View: React.FC<Car360ViewProps> = ({ carImages, zoomLevel, buttonId }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (buttonId === 'left') {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + carImages.length) % carImages.length);
    } else if (buttonId === 'right') {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % carImages.length);
    }
  }, [buttonId, carImages.length]);

  return (
    <div className="car-360-view">
      <img
        src={carImages[currentImageIndex]}
        alt="Car 360 view"
        className="car-image"
        style={{ transform: `scale(${zoomLevel})` }}
      />
    </div>
  );
};

export default Car360View;
