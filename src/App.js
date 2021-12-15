import React, { useRef } from "react";
import * as handPoseDetection from "@tensorflow-models/hand-pose-detection";
import "@tensorflow/tfjs-backend-webgl";
import Webcam from "react-webcam";
import {
  drawKeypoints,
  getDistanceBetweenThumbAndFinger,
  getRotationAngle,
} from "./utilities";
import ResizableSquare from "./components/ResizableSquare";

function App() {
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);
  const boxRef = useRef(null);

  let detector;

  const createDetector = async () => {
    const model = handPoseDetection.SupportedModels.MediaPipeHands;
    const detectorConfig = {
      runtime: "tfjs",
      modelType: "full",
      maxHands: 1,
    };
    detector = await handPoseDetection.createDetector(model, detectorConfig);
    setInterval(() => {
      detect();
    }, 30);
  };

  const detect = async () => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // Make Detections
      const hands = await detector.estimateHands(video);

      if (hands.length > 0) {
        const pinchDistance =
          getDistanceBetweenThumbAndFinger(hands[0].keypoints) * 2;

        //  set box size based on distance between thumb and index finger
        boxRef.current.style.width = `${pinchDistance}px`;
        boxRef.current.style.height = `${pinchDistance}px`;

        //  rotate box based on x axis of index finger
        boxRef.current.style.transform = `rotate(
          ${getRotationAngle(hands[0].keypoints) / 2}deg
        )`;

        // Draw mesh
        const ctx = canvasRef.current.getContext("2d");

        requestAnimationFrame(() => {
          drawKeypoints(hands[0].keypoints, ctx, canvasRef.current);
        });
      }
    }
  };

  createDetector();

  return (
    <div className="App">
      <Webcam
        ref={webcamRef}
        style={{
          position: "absolute",
          top: 40,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 340,
          height: 180,
        }}
      />

      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 40,
          right: 0,
          textAlign: "center",
          zindex: 9,
          width: 340,
          height: 180,
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20%",
        }}
      >
        <ResizableSquare ref={boxRef} />
      </div>
    </div>
  );
}

export default App;
