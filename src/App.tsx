import React, { useEffect, useRef, useState } from 'react';
import * as tf from '@tensorflow/tfjs'; // Import TensorFlow.js
import './App.css';

const App: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGrayscale, setIsGrayscale] = useState(false);

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
  }, []);

  useEffect(() => {
    const detectHand = async () => {
      try {
        // Set the TensorFlow.js backend to 'webgl'
        await tf.setBackend('webgl'); 

        // Load the Handpose model
        const handpose = await import('@tensorflow-models/handpose');
        const net = await handpose.load();
        const video = videoRef.current!;
        const ctx = canvasRef.current!.getContext('2d');

        const detect = async () => {
          if (video.readyState === video.HAVE_ENOUGH_DATA) {
            ctx!.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx!.save(); // Speichere den aktuellen Zustand des Kontextes
            ctx!.scale(-1, 1); // Spiegel das Bild horizontal
            ctx!.translate(-canvasRef.current!.width, 0); // Bewege den Ursprung des Canvas nach rechts
            ctx!.drawImage(video, 0, 0, canvasRef.current!.width, canvasRef.current!.height);
            ctx!.restore(); // Setze den Kontext zurück

            const predictions = await net.estimateHands(video);

            if (predictions.length > 0) {
              const hand = predictions[0].boundingBox;
              const handCenterX = (hand.topLeft[0] + hand.bottomRight[0]) / 2;
              const frameWidth = canvasRef.current!.width;

              // Check if hand is on the left or right side of the frame
              if (handCenterX < frameWidth / 2) {
                setIsGrayscale(true);
              } else {
                setIsGrayscale(false);
              }
            }
          }

          requestAnimationFrame(detect);
        };

        detect();
      } catch (err) {
        console.error("Error loading the Handpose model or during hand detection: ", err);
        alert("An error occurred while loading the hand detection model.");
      }
    };

    detectHand();
  }, []);

  return (
    <div className="App">
      <video ref={videoRef} style={{ display: 'none' }} />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        style={{ filter: isGrayscale ? 'grayscale(100%)' : 'none' }}
      />
    </div>
  );
};

export default App;
