import gt2 from '../pictures/gt2.png';
import comp2 from '../pictures/comp2.png';
import m2 from '../pictures/m2.png';



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

export const carData: CarData[] = [
  {
    title: "MERCEDES BENZ GT63",
    image: gt2,
    year: 2015,
    mileage: 1744,
    horsepower: 887,
    price: "$1,495,000",
    location: "Las Vegas, NV",
    backgroundGradient: "linear-gradient(to bottom, #000000, #ffffff)" 
  },
  {
    title: "BMW M4 COMPETITION",
    image: comp2,
    year: 2017,
    mileage: 1050,
    horsepower: 503,
    price: "$67,500",
    location: "Munich, Germany",
    backgroundGradient: "linear-gradient(to bottom, #d5d5d2, #f5f5f5)" 
  },
  {
    title: "BMW M4 F82",
    image: m2,
    year: 2018,
    mileage: 1200,
    horsepower: 425,
    price: "$60,000",
    location: "Los Angeles, CA",
    backgroundGradient: "linear-gradient(to bottom, #ffb6c1, #ffe4e1)" 
  }
];


const CarDetails: React.FC<CarDetailsProps> = ({ currentCar }) => {
  return (
    <div
      className="car-details-container">
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
