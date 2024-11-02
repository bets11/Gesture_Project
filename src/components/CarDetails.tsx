import React from 'react';
import gt2 from '../pictures/gt2.png';
import comp2 from '../pictures/comp2.png';
import m2 from '../pictures/m2.png';
import carDataJson from '../carData.json';

interface CarDetailsProps {
  currentCar: CarData;
  zoomLevel: number;
}

export interface CarData {
  title: string;
  image: string;
  year: number;
  mileage: number;
  horsepower: number;
  price: string;
  location: string;
  backgroundGradient: string; 
}

const imageMap = {
  gt2,
  comp2,
  m2
};

export const carData = carDataJson.map(car => ({
  ...car,
  image: imageMap[car.image as keyof typeof imageMap]
}));

const CarDetails: React.FC<CarDetailsProps> = ({ currentCar }) => {
  return (
    <div className="car-details-container">
      <div style={{ display: 'inline-flex', gap: '40px', width: '800px' }}>
        <div style={{ textAlign: 'left', marginRight: '30px', marginLeft: '200px' }}>
          <span style={{ fontSize: '20px', color: '#333', marginBottom: '5px' }}>Year: </span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{currentCar.year}</span>
        </div>
        <div style={{ textAlign: 'left', marginRight: '30px', marginLeft: '40px' }}>
          <span style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>Horsepower: </span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{currentCar.horsepower}</span>
        </div>
        <div style={{ textAlign: 'left', marginRight: '30px', marginLeft: '40px'}}>
          <span style={{ fontSize: '20px', color: '#333', marginBottom: '15px' }}>Mileage: </span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{currentCar.mileage.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default CarDetails;
