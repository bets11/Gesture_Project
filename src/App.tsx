import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs'; 
import '@tensorflow/tfjs-backend-webgl'; 
import * as handpose from '@tensorflow-models/handpose'; 
import './App.css';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [zoomLevel, setZoomLevel] = useState(1); 
  const [rotation, setRotation] = useState(0); 

  let buttonHoverTimeout: NodeJS.Timeout | null = null;

  //ZONES
  const buttonZones = {
    plus: {left: 400, top: 150, right: 500, bottom: 250   }, 
    minus: {left: 100, top: 150, right: 200, bottom: 250 },
    //left: { left: 100, top: 250, right: 200, bottom: 350 },  
    //right: { left: 400, top: 250, right: 500, bottom: 350 }, 
    //prevCar: { left: 100, top: 350, right: 200, bottom: 450 }, 
    //nextCar: { left: 400, top: 350, right: 500, bottom: 450 }, 
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

  //drawing red circle
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
      
      //hand in defined buttonZones
      if (x > zone.left && x < zone.right && y > zone.top && y < zone.bottom) {
        console.log(`Hand is over: ${buttonId}`); 
        handleButtonHover(buttonId); 
      }
    });
  };

  const handleButtonHover = (buttonId: string) => {
    if (buttonHoverTimeout) {
      clearTimeout(buttonHoverTimeout);
    }

    buttonHoverTimeout = setTimeout(() => {
      performAction(buttonId); 
    }, 1000); 
  };

  //actions, when hovered over button 
  const performAction = (buttonId: string) => {
    switch (buttonId) {
      case 'plus':
        setZoomLevel(prev => Math.min(prev + 0.1, 2)); 
        break;
      case 'minus':
        setZoomLevel(prev => Math.max(prev - 0.1, 0.5)); 
        break;
      //case 'left':
        //setRotation(prev => prev - 90);
        //break;
      //case 'right':
        //setRotation(prev => prev + 90);
        //break;
      //case 'prevCar':
        //console.log('Vorheriges Auto');
       //break;
      //case 'nextCar':
        //console.log('Nächstes Auto');
        //break;
      //default:
        //break;
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
        />
        <div className="overlay">
          <div className="circle">
            <div className="title">MERCEDES BENZ CLE Coupé</div>
            <img src="src/pictures/m4.png" alt="Car Image" className="car-image" />
            <div className="button-columns">
              <div className="button-column">
                <button id="plus" className="circle-button">+</button>
                <button id="left" className="circle-button">&lt;</button>
                <button id="prevCar" className="circle-button">&lt;&lt;</button>
              </div>
              <div className="button-column">
                <button id="minus" className="circle-button">-</button>
                <button id="right" className="circle-button">&gt;</button>
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
