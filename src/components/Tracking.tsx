import React, { useEffect, useRef, useState } from 'react';
import * as handpose from '@tensorflow-models/handpose';
import '@tensorflow/tfjs-backend-webgl';

interface TrackingProps {
  onHandOverButton: (buttonId: string | null) => void;
  buttonZones: {
    [key: string]: { left: number; top: number; right: number; bottom: number };
  };
}

const Tracking: React.FC<TrackingProps> = ({ onHandOverButton, buttonZones }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [model, setModel] = useState<handpose.HandPose | null>(null);
  const [currentHoveredButton, setCurrentHoveredButton] = useState<string | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      const net = await handpose.load();
      setModel(net);
    };
    loadModel();
  }, []);
  
  useEffect(() => {
    const loadCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => videoRef.current?.play();
        }
      } catch (err) {
        console.error("Error accessing the camera:", err);
        alert("Unable to access the camera. Please check camera permissions.");
      }
    };

    const detectHand = async () => {
      if (!model) return;
      
      const detect = async () => {
        if (videoRef.current!.readyState === videoRef.current!.HAVE_ENOUGH_DATA) {
          const ctx = canvasRef.current!.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
            
            const predictions = await model.estimateHands(videoRef.current!);
            if (predictions.length > 0) {
              const hand = predictions[0].boundingBox;
              const handCenterX = (hand.topLeft[0] + hand.bottomRight[0]) / 2;
              const handCenterY = (hand.topLeft[1] + hand.bottomRight[1]) / 2;
              
              checkHandOnButton(handCenterX, handCenterY);
              drawHandPoint(ctx, handCenterX, handCenterY);
            } else {
              resetHoverState();
            }
          }
        }
        requestAnimationFrame(detect);
      };

      detect();
    };

    if (model) {
      loadCamera();
      detectHand();
    }
  }, [model, buttonZones, onHandOverButton]);

  const checkHandOnButton = (x: number, y: number) => {
    let isHandOverButton = false;
    Object.keys(buttonZones).forEach((buttonId) => {
      const zone = buttonZones[buttonId];
      if (x > zone.left && x < zone.right && y > zone.top && y < zone.bottom) {
        isHandOverButton = true;
        if (currentHoveredButton !== buttonId) {
          setCurrentHoveredButton(buttonId);
          onHandOverButton(buttonId);
        }
      }
    });

    if (!isHandOverButton) {
      resetHoverState();
    }
  };

  const resetHoverState = () => {
    if (currentHoveredButton) {
      onHandOverButton(null);
      setCurrentHoveredButton(null);
    }
  };

  const drawHandPoint = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  };

  return (
    <>
      <video ref={videoRef} className="videobox" width={640} height={480} autoPlay />
      <canvas ref={canvasRef} className="canvasbox" width={640} height={480} />
    </>
  );
};

export default Tracking;
