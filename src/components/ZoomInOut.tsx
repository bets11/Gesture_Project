import React, { useState, useEffect } from 'react';

interface ZoomInOutProps {
  onZoomChange: (zoomLevel: number) => void;
  buttonId: string | null;
}

const ZoomInOut: React.FC<ZoomInOutProps> = ({ onZoomChange, buttonId }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoverStartTime, setHoverStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (buttonId === 'plus' || buttonId === 'minus') {
      setHoverStartTime(Date.now());
    } else {
      setHoverStartTime(null);
    }
  }, [buttonId]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hoverStartTime && (Date.now() - hoverStartTime >= 2000)) {
        setZoomLevel((prevZoom) =>
          buttonId === 'plus' ? Math.min(prevZoom + 0.1, 2) : Math.max(prevZoom - 0.1, 0.5)
        );
        setHoverStartTime(null);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [hoverStartTime, buttonId]);

  useEffect(() => {
    onZoomChange(zoomLevel);
  }, [zoomLevel, onZoomChange]);

  return null;
};

export default ZoomInOut;
