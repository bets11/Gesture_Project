import React, { useState } from 'react';
import Tracking from './Tracking';

const Car360View: React.FC = () => {
  const gtViews = ['gt1.jpg', 'gt2.jpg', 'gt3.jpg', 'gt4.jpg'];
  const [currentIndex, setCurrentIndex] = useState(0);

  // Button-Zonen definieren (Koordinaten müssen an dein Layout angepasst werden)
  const buttonZones = {
    middleLeft: { left: 100, top: 200, right: 200, bottom: 300 },
    middleRight: { left: 400, top: 200, right: 500, bottom: 300 },
  };

  // Funktion, die aufgerufen wird, wenn die Hand über einem Button ist
  const handleHandOverButton = (buttonId: string) => {
    setCurrentIndex((prevIndex) => {
      if (buttonId === 'middleLeft') {
        return (prevIndex - 1 + gtViews.length) % gtViews.length;
      } else if (buttonId === 'middleRight') {
        return (prevIndex + 1) % gtViews.length;
      }
      return prevIndex;
    });
  };

  return (
    <div className="car-360-view">
      <Tracking onHandOverButton={handleHandOverButton} buttonZones={buttonZones} />
      
      <img
        src={gtViews[currentIndex]}
        alt={`Car View ${currentIndex + 1}`}
        className="car-image"
      />
    </div>
  );
};

export default Car360View;
