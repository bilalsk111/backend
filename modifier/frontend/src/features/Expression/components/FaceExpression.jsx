import { useEffect, useRef, useState } from "react";
import { detect, init } from "../utils/utils";
import { ScanFace, Sparkles, RefreshCcw } from "lucide-react";
import "../../Expression/style/scan.scss";

const moodEmoji = {
  Happy: "😊",
  Sad: "😔",
  Angry: "😠",
  Surprised: "😲",
  Neutral: "😐"
};

export default function FaceExpression({onClick = ()=>{ }}) {
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const streamRef = useRef(null);

  const [expression, setExpression] = useState("Waiting...");
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    init({ landmarkerRef, videoRef, streamRef });


    return () => {
      if (landmarkerRef.current) landmarkerRef.current.close();
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const handleDetection = async () => {
    setIsScanning(true);
    setExpression("Analyzing...");

    const expression =  await detect({ landmarkerRef, videoRef, setExpression });
    onClick(expression)
    setTimeout(() => setIsScanning(false), 1000);
  };

  return (
    <div className="face-scanner-container">
      <div className="glass-card">

        <div className="card-header">
          <ScanFace size={18}/>
          <span>AI Expression Scanner</span>
        </div>

        <div className={`video-wrapper ${isScanning ? "scanning" : ""}`}>
          <video ref={videoRef} className="video-feed" playsInline />

          <div className="scan-line"/>
          <div className="scanner-grid"/>

          <div className="corner tl"/>
          <div className="corner tr"/>
          <div className="corner bl"/>
          <div className="corner br"/>

          {isScanning && (
            <div className="analysis-overlay">
              <Sparkles size={26}/>
              <span>AI analyzing face...</span>
            </div>
          )}
        </div>

        <div className="info-section">

          <div className="status-row">
            <div className={`status-dot ${isScanning ? "pulse" : ""}`}/>
            <span>{isScanning ? "Processing" : "Live Camera"}</span>
          </div>

          <h2 className={`expression-text ${isScanning ? "blur" : ""}`}>
            {moodEmoji[expression] || ""} {expression}
          </h2>

          <button
            className="detect-btn"
            onClick={handleDetection}
            disabled={isScanning}
          >
            {isScanning ? (
              <RefreshCcw className="spin" size={18}/>
            ) : (
              <Sparkles size={18}/>
            )}
            {isScanning ? "Scanning..." : "Detect Expression"}
          </button>

        </div>
      </div>
    </div>
  );
}