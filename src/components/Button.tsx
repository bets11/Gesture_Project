import React from 'react';
import '../css/Button.css';

interface ButtonProps {
  id: string;
  hovered: boolean;
  onHover: (id: string) => void;
}

const Button: React.FC<ButtonProps> = ({ id, hovered, onHover }) => {
  const handleHover = () => {
    onHover(id);
  };

  const iconClasses: { [key: string]: string } = {
    plus: 'bi-zoom-in',
    minus: 'bi-zoom-out',
    left: 'bi-car-front',
    right: 'bi-car-front-fill',
    prevCar: 'bi-arrow-left',
    nextCar: 'bi-arrow-right'
  };

  return (
    <button
      id={id}
      className={`circle-button ${hovered ? 'hovered' : ''}`}
      onMouseOver={handleHover}
    >
      <i className={`bi ${iconClasses[id]}`} style={{ fontSize: '20px' }}></i>
    </button>
  );
};

export default Button;
