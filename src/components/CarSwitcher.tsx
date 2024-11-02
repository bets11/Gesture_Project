import React, { useState, useEffect } from 'react';
import { CarData } from './CarDetails';
import CarDetails from './CarDetails';

interface CarSwitcherProps {
  carData: CarData[];
  zoomLevel: number;
  buttonId: string | null;
  updateBackground: (newBackground: string) => void; // Neue Prop hinzufügen
}

const CarSwitcher: React.FC<CarSwitcherProps> = ({ carData, zoomLevel, buttonId, updateBackground }) => {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);
  const currentCar = carData[currentCarIndex];

  useEffect(() => {
    if (buttonId === 'prevCar' || buttonId === 'nextCar') {
      setHoverStartTime(Date.now());
    } else {
      setHoverStartTime(null);
    }
  }, [buttonId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hoverStartTime && (Date.now() - hoverStartTime >= 2000)) {
        setCurrentCarIndex((prev) => {
          const newIndex = buttonId === 'prevCar'
            ? (prev - 1 + carData.length) % carData.length
            : (prev + 1) % carData.length;
          updateBackground(carData[newIndex].backgroundGradient);
          return newIndex;
        });
        setHoverStartTime(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [hoverStartTime, buttonId, carData.length, updateBackground, carData]);

  return (
    <div>
    <div className="car-image-container">
      <img
        src={currentCar.image}
        alt={currentCar.title}
        className="car-image"
        style={{ transform: `scale(${zoomLevel})` }}
      />
      <h2 className="title">{currentCar.title}</h2>
      <CarDetails currentCar={currentCar} zoomLevel={zoomLevel} />
    </div>
    </div>
  );
};

export default CarSwitcher;
