import React, { useRef, useState, useEffect } from "react";
import { useSong } from "../../home/hooks/useSong";
import {
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  Repeat,
  Shuffle,
  Gauge,
} from "lucide-react";
import "../../home/style/Player.scss";

const Player = () => {
  const { song } = useSong();

  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // ✅ return AFTER hooks
  if (!song) return null;

  const onTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;
    setProgress((current / duration) * 100 || 0);
  };

  const togglePlay = () => {
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const duration = audioRef.current.duration;
    audioRef.current.currentTime = (clickX / width) * duration;
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="spotify-player">
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="player-left">
        <img src={song.posterUrl} alt="poster" className="now-playing-art" />
        <div className="song-meta">
          <p className="song-name">{song.title}</p>
          <p className="song-mood">{song.mood}</p>
        </div>
        <button className="icon-btn heart-btn">
          <Heart size={18} />
        </button>
      </div>

      <div className="player-center">
        <div className="control-buttons">
          <button className="icon-btn secondary-btn">
            <Shuffle size={16} />
          </button>

          <button
            className="icon-btn skip-btn"
            onClick={() => (audioRef.current.currentTime -= 5)}
          >
            <SkipBack size={20} fill="currentColor" />
          </button>

          <button className="play-btn" onClick={togglePlay}>
            {isPlaying ? "Pause" : "Play"}
          </button>

          <button
            className="icon-btn skip-btn"
            onClick={() => (audioRef.current.currentTime += 5)}
          >
            <SkipForward size={20} fill="currentColor" />
          </button>

          <button className="icon-btn secondary-btn">
            <Repeat size={16} />
          </button>
        </div>

        <div className="playback-wrapper">
          <span className="time">
            {formatTime(audioRef.current?.currentTime)}
          </span>

          <div className="progress-container" onClick={handleSeek}>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <span className="time">
            {formatTime(audioRef.current?.duration)}
          </span>
        </div>
      </div>

      <div className="player-right">
        <div className="speed-selector">
          <Gauge size={18} />
          <select
            value={speed}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setSpeed(val);
              audioRef.current.playbackRate = val;
            }}
          >
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <div className="volume-control">
          <Volume2 size={18} />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;