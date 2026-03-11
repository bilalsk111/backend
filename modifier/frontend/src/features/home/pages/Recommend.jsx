import React, { useEffect, useState } from "react";
import { useSong } from "../hooks/useSong";
import {
  Play,
  Pause,
  Heart,
  MoreVertical,
  Headphones,
  LayoutGrid,
  BarChart3
} from "lucide-react";
import "../../home/style/Recommend.scss";

const Recommend = () => {
  const {
    recommendations,
    song: currentSong,
    handleGetSong,
    loading,
    setSongAndPlay,
    togglePlayPause,
    isPlaying
  } = useSong();

  const [activeFilter, setActiveFilter] = useState("All");
  const [likedSongs, setLikedSongs] = useState({});

const handleCardClick = (item) => {
  if (currentSong?.videoId === item.videoId) togglePlayPause();
  else setSongAndPlay(item);
};

  const toggleLike = (videoId) => {
    setLikedSongs((prev) => ({ ...prev, [videoId]: !prev[videoId] }));
  };

  return (
    <div className="recommend-container">
      <header className="recommend-header">
        <div className="title-area">
          <div className="badge">PREMIUM SELECTION</div>
          <h1>
            Music<span> Discovery</span>
          </h1>
          <p>Curated tracks based on your emotional profile.</p>
        </div>

        <div className="stats-row">
          <div className="stat-pill">
            <div className="pill-icon blue">
              <Headphones size={16} />
            </div>
            <div className="pill-text">
              <strong>{recommendations.length}</strong>
              <span>Songs</span>
            </div>
          </div>
          <div className="stat-pill">
            <div className="pill-icon purple">
              <LayoutGrid size={16} />
            </div>
            <div className="pill-text">
              <strong>6</strong>
              <span>Moods</span>
            </div>
          </div>
        </div>
      </header>

      <nav className="filter-nav">
        <div className="nav-label">
          <BarChart3 size={14} /> FILTER BY MOOD
        </div>
        <div className="chip-group">
          {["All", "Happy", "Sad", "Calm", "Neutral", "Angry", "Surprised"].map(
            (m) => (
              <button
                key={m}
                className={`mood-chip ${activeFilter === m ? "active" : ""}`}
                onClick={() => {
                  setActiveFilter(m);
                  handleGetSong(m);
                }}
              >
                {m}
              </button>
            )
          )}
        </div>
      </nav>

      {loading ? (
        <div className="loader-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton-card" />
          ))}
        </div>
      ) : (
        <div className="music-grid">
          {recommendations.map((item) => {
            const isSelected = currentSong?.videoId === item.videoId;
            const isLiked = likedSongs[item.videoId] || false;

            return (
              <div
                key={item.videoId}
                className={`premium-card ${isSelected ? "active" : ""}`}
                onClick={() => handleCardClick(item)}
              >
                <div className="thumbnail-box">
                  <img src={item.posterUrl} alt={item.title} />
                  <div className="mood-tag">{item.mood || activeFilter}</div>

                  <div className="interaction-overlay">
                    <div className="play-btn-circle">
                      {isSelected && isPlaying ? (
                        <Pause size={32} fill="white" color="white" />
                      ) : (
                        <Play size={32} fill="white" color="white" />
                      )}
                    </div>
                  </div>

                  <button
                    className={`heart-btn ${isLiked ? "liked" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.videoId);
                    }}
                  >
                    <Heart size={18} />
                  </button>
                </div>

                <div className="track-meta">
                  <h4>{item.title}</h4>
                  <div className="artist-line">
                    <span>{item.artist}</span>
                    <MoreVertical size={14} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Recommend;