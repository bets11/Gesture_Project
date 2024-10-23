import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs'; 
import '@tensorflow/tfjs-backend-webgl'; 
import * as handpose from '@tensorflow-models/handpose'; 
import './css/App.css';
import m4 from './pictures/m4.png';
import competition from './pictures/competition.png';
import cle from './pictures/cle.png';
import Button from './Button'; 
tf.setBackend('webgl');


const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1); 
  const [rotation, setRotation] = useState(0); 
  const [currentImage, setCurrentImage] = useState(0); 

  

  let buttonHoverTimeouts: { [key: string]: NodeJS.Timeout | null } = {
    plus: null,
    minus: null,
    prevCar: null,
    nextCar: null
  };
  let hoverStartTime: number | null = null; 


  const carImages = [cle, competition, m4];
  const carTitles = ["Mercedes Benz CLE", "M4 Competition", "M4"]; 

  const buttonZones = {
    plus: {left: 200, top: 90, right: 600, bottom: 100}, 
    minus: {left: 100, top: 90, right: 200, bottom: 250},
    prevCar: {left: 400, top: 350, right: 500, bottom: 550}, 
    nextCar: {left: 100, top: 350, right: 200, bottom: 550}
  };

  useEffect(() => {
    const loadCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            try {
              videoRef.current?.play();
            } catch (error) {
              console.error("Error during play: ", error);
            }
          };
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
    Object.keys(buttonZones).forEach(buttonId => {
      const zone = buttonZones[buttonId as keyof typeof buttonZones];
  
      if (x > zone.left && x < zone.right && y > zone.top && y < zone.bottom) {
        const button = document.getElementById(buttonId);
        if (button) {
          button.classList.add('hover');
  
          if (!buttonHoverTimeouts[buttonId]) {
            console.log(`Hand is over the button ${buttonId}, starting 3 second timer...`);
  
            buttonHoverTimeouts[buttonId] = setTimeout(() => {
              performAction(buttonId); 
              console.log(`Action for button ${buttonId} executed after 3 seconds.`);
              buttonHoverTimeouts[buttonId] = null; 
            }, 3000); 
          }
        }
      } else {
        const button = document.getElementById(buttonId);
        if (button) {
          button.classList.remove('hover');
        }
        if (buttonHoverTimeouts[buttonId]) {
          clearTimeout(buttonHoverTimeouts[buttonId] as NodeJS.Timeout); 
          buttonHoverTimeouts[buttonId] = null; 
          console.log(`Hand left the button ${buttonId}, timer cleared.`);
        }
      }
    });
  };

  const handleButtonHover = (buttonId: string) => {
    if (buttonHoverTimeouts[buttonId]) {
      clearTimeout(buttonHoverTimeouts[buttonId] as NodeJS.Timeout);  
    }

    buttonHoverTimeouts[buttonId] = setTimeout(() => {
      performAction(buttonId);
      buttonHoverTimeouts[buttonId] = null;  
    }, 500);  
};

  const performAction = (buttonId: string) => {
    switch (buttonId) {
      case 'plus':
        setZoomLevel(prev => Math.min(prev + 0.1, 2)); 
        break;
      case 'minus':
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); 
        break;
      case 'prevCar':
         setCurrentImage((prev) => (prev - 1 + carImages.length) % carImages.length); 
         break;
      case 'nextCar':
        setCurrentImage((prev) => (prev + 1) % carImages.length); 
        break;
      default:
        break;
    }
  };

  return (
      <div className="App">
    <div className="title">{carTitles[currentImage]}</div>
    <div className="camera-container" style={{ transform: `scale(${zoomLevel}) rotate(${rotation}deg)` }}>
      <video ref={videoRef} className="videobox" id="video" width={640} height={480} autoPlay />
      <canvas
        ref={canvasRef}
        id="canvas"
        className="canvasbox"
        width={640}
        height={480}
      />
      <div className="overlay">
        <div className="button-columns">
          <div className="button-row">
            <Button id="plus" onHover={handleButtonHover} />
            <Button id="minus" onHover={handleButtonHover} />
          </div>
          <div className="button-row">
            <Button id="left" onHover={handleButtonHover} />
            <Button id="right" onHover={handleButtonHover} />
          </div>
          <div className="button-row">
            <Button id="prevCar" onHover={handleButtonHover} />
            <Button id="nextCar" onHover={handleButtonHover} />
          </div>
        </div>
        <div className="circle">
          <img src={carImages[currentImage]} alt="Car Image" className="car-image" />
        </div>
      </div>
    </div>
  </div>

  );
};

export default App;
