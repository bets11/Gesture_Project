import React, { useState, useEffect } from 'react';
import { CarData } from './CarDetails';
import CarDetails from './CarDetails';
import Car360View from './Car360View';
import gt1 from '../pictures/gt1.png';
import gt2 from '../pictures/gt2.png';
import gt3 from '../pictures/gt3.png';
import gt4 from '../pictures/gt4.png';
import comp1 from '../pictures/comp1.png';
import comp2 from '../pictures/comp2.png';
import comp3 from '../pictures/comp3.png';
import comp4 from '../pictures/comp4.png';
import m1 from '../pictures/m1.png';
import m2 from '../pictures/m2.png';
import m3 from '../pictures/m3.png';
import m4 from '../pictures/m4.png';
import '../css/CarSwitcher.css';

interface CarSwitcherProps {
  carData: CarData[];
  zoomLevel: number;
  buttonId: string | null;
  updateBackground: (newBackground: string) => void;
}

const CarSwitcher: React.FC<CarSwitcherProps> = ({ carData, zoomLevel, buttonId, updateBackground }) => {
  const [currentCarIndex, setCurrentCarIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const currentCar = carData[currentCarIndex];

  const carViews = [
    [gt1, gt2, gt3, gt4],
    [comp1, comp2, comp3, comp4],
    [m1, m2, m3, m4],
  ];

  useEffect(() => {
    updateBackground(currentCar.backgroundGradient);
  }, [currentCarIndex, updateBackground, currentCar.backgroundGradient]);

  useEffect(() => {
    if (buttonId === 'prevCar' || buttonId === 'nextCar') {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentCarIndex((prevIndex) =>
          buttonId === 'prevCar'
            ? (prevIndex - 1 + carData.length) % carData.length
            : (prevIndex + 1) % carData.length
        );
        setIsTransitioning(false);
      }, 500); // Übergangsdauer
    }
  }, [buttonId, carData.length]);

  return (
    <div className="car-image-container">
      <div className={`car-image ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
        <Car360View
          carImages={carViews[currentCarIndex]}
          zoomLevel={zoomLevel}
          buttonId={buttonId}
        />
      </div>
      <h2 className="title">{currentCar.title}</h2>
      <CarDetails currentCar={currentCar} zoomLevel={zoomLevel} />
    </div>
  );
};

export default CarSwitcher;
