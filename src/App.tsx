import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs'; 
import '@tensorflow/tfjs-backend-webgl'; 
import * as handpose from '@tensorflow-models/handpose'; 
import './App.css';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGrayscale, setIsGrayscale] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); 
  const [rotation, setRotation] = useState(0); 

  let buttonHoverTimeout: NodeJS.Timeout | null = null;

  useEffect(() => {
    const loadCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (err) {
        console.error("Error accessing the camera: ", err);
        alert("Unable to access the camera. Please check camera permissions.");
      }
    };

    loadCamera();

    const detectHand = async () => {
      const net = await handpose.load(); 
      
      const detect = async () => {
        if (videoRef.current!.readyState === videoRef.current!.HAVE_ENOUGH_DATA) {
          const ctx = canvasRef.current!.getContext('2d'); 

          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); 
            ctx.drawImage(videoRef.current!, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
            
            const predictions = await net.estimateHands(videoRef.current!);
        
            if (predictions.length > 0) {
              const hand = predictions[0].boundingBox;
              const handCenterX = (hand.topLeft[0] + hand.bottomRight[0]) / 2;
              const handCenterY = (hand.topLeft[1] + hand.bottomRight[1]) / 2;
        
              checkHandOnButton(handCenterX, handCenterY);
        
              drawHandPoint(ctx, handCenterX, handCenterY);
            }
          }
        }
        requestAnimationFrame(detect); 
      };

      detect();
    };

    detectHand();
  }, []);

  const drawHandPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI); 
    ctx.fillStyle = 'red'; 
    ctx.fill();
    ctx.closePath();
  };

  const checkHandOnButton = (x: number, y: number) => {
    const buttons = document.querySelectorAll('.circle-button');
    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      if (x > rect.left && x < rect.right && y > rect.top && y < rect.bottom) {
        handleButtonHover(button.id); 
      }
    });
  };

  const handleButtonHover = (buttonId: string) => {
    if (buttonHoverTimeout) {
      clearTimeout(buttonHoverTimeout);
    }

    buttonHoverTimeout = setTimeout(() => {
      performAction(buttonId); 
    }, 3000); 
  };

  const performAction = (buttonId: string) => {
    switch (buttonId) {
      case 'plus':
        setZoomLevel(prev => Math.min(prev + 0.1, 2)); 
        break;
      case 'minus':
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); 
        break;
      case 'left':
        setRotation(prev => prev - 90); 
        break;
      case 'right':
        setRotation(prev => prev + 90); 
        break;
      case 'prevCar':
        console.log('Vorheriges Auto');
        break;
      case 'nextCar':
        console.log('Nächstes Auto');
        break;
      default:
        break;
    }
  };

  return (
    <div className="App">
      <div className="camera-container" style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}>
        <video ref={videoRef} className="videobox" id="video" width={640} height={480} autoPlay />
        <canvas
          ref={canvasRef}
          id="canvas"
          className="canvasbox"
          width={640}
          height={480}
          style={{ filter: isGrayscale ? 'grayscale(100%)' : 'none' }}
        />
        <div className="overlay">
          <div className="circle">
            <div className="title">MERCEDES BENZ CLE Coupé</div>
            <img src="src/pictures/cle.png" alt="Car Image" className="car-image" />
            <div className="button-columns">
              <div className="button-column">
                <button id="plus" className="circle-button">+</button>
                <button id="minus" className="circle-button">-</button>
                <button id="left" className="circle-button">&lt;</button>
              </div>
              <div className="button-column">
                <button id="right" className="circle-button">&gt;</button>
                <button id="prevCar" className="circle-button">&lt;&lt;</button>
                <button id="nextCar" className="circle-button">&gt;&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
