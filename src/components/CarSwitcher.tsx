import React, { useState, useEffect } from 'react';

interface CarSwitcherProps {
  carImages: string[];
  carTitles: string[];
  zoomLevel: number;
  buttonId: string | null; 
}

const CarSwitcher: React.FC<CarSwitcherProps> = ({ carImages, carTitles, zoomLevel, buttonId }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);

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
        if (buttonId === 'prevCar') {
          setCurrentImage((prev) => (prev - 1 + carImages.length) % carImages.length);
        } else if (buttonId === 'nextCar') {
          setCurrentImage((prev) => (prev + 1) % carImages.length);
        }
        setHoverStartTime(null); 
      }
    }, 100);

    return () => clearInterval(interval); 
  }, [hoverStartTime, buttonId, carImages.length]);

  return (
    <div className="circle">
      <img
        src={carImages[currentImage]}
        alt={carTitles[currentImage]}
        className="car-image"
        style={{ transform: `scale(${zoomLevel})` }}
      />
      <h2 className="title">{carTitles[currentImage]}</h2>
    </div>
  );
};

export default CarSwitcher;
