import React from 'react';
import '../css/App.css';

interface CarSwitcherProps {
  currentImage: number;
  carImages: string[];
  carTitles: string[];
}

const CarSwitcher: React.FC<CarSwitcherProps> = ({ currentImage, carImages, carTitles }) => {
  return (
    <div className="circle">
      <div className="title">{carTitles[currentImage]}</div>
      <img src={carImages[currentImage]} alt="Car Image" className="car-image" />
    </div>
  );
};

export default CarSwitcher;
