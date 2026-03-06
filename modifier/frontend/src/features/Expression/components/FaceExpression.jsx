import { useEffect, useRef, useState } from "react";
import { init, detect } from "../utils/utils";
import { Camera, RefreshCcw, ScanFace } from "lucide-react";

import "../style/scan.scss";

const moodEmoji = {
  happy: "😊",
  sad: "😔",
  angry: "😠",
  surprised: "😲",
  neutral: "😐",
};

export default function FaceExpression({ onClick = () => {} }) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("neutral");
  const [isScanning, setIsScanning] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);

  /**
   * Initialize camera + mediapipe
   */
  useEffect(() => {
    const setupCamera = async () => {
      await init({ landmarkerRef, videoRef, streamRef });
      setCameraReady(true);
    };

    setupCamera();

    return () => {
      if (landmarkerRef.current) landmarkerRef.current.close();

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  /**
   * Detect expression
   */
  const handleDetectExpression = async () => {
    if (isScanning || !cameraReady) return;

    setIsScanning(true);

    const result = await detect({
      landmarkerRef,
      videoRef,
      setExpression,
    });

    document.body.className = `mood-${result}`;

    onClick(result);

    setTimeout(() => {
      setIsScanning(false);
    }, 900);
  };

  return (
    <div className="scanner-container">
      <div className="scanner-card">
        {/* HEADER */}
        <div className="scanner-header">
          <ScanFace size={18} />
          <span>{cameraReady ? "AI FACE SCANNER" : "INITIALIZING..."}</span>
          <div className={`status-dot ${cameraReady ? "online" : "offline"}`} />
        </div>

        {/* CAMERA */}
        <div className="camera-wrapper">
          <video
            ref={videoRef}
            className="camera-feed"
            autoPlay
            muted
            playsInline
          />

          <div className="scan-line" />
          <div className="scanner-grid" />

          <div className="corner tl" />
          <div className="corner tr" />
          <div className="corner bl" />
          <div className="corner br" />

          {isScanning && (
            <div className="scan-overlay">
              <RefreshCcw className="spin" size={28} />
              <p>Analyzing Face...</p>
            </div>
          )}
        </div>

        {/* RESULT */}
        <div className="expression-section">
          <h2 className="expression-text">
            {moodEmoji[expression.toLowerCase()] || "😐"} {expression}
          </h2>
        </div>

        {/* BUTTON */}
        <button
          className="scan-button"
          onClick={handleDetectExpression}
          disabled={!cameraReady || isScanning}
        >
          {isScanning ? (
            <>
              <RefreshCcw size={18} className="spin" />
              Scanning...
            </>
          ) : (
            <>
              <Camera size={18} />
              Capture Expression
            </>
          )}
        </button>
      </div>
    </div>
  );
}
