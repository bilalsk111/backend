import React from 'react'
import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../../home/components/Player'
import MusicCards from '../components/MusicCards'
import { LayoutGrid, Search, User, Sparkles, Heart, Zap } from 'lucide-react'
import '../../home/style/Home.scss'
import { useSong } from '../hooks/useSong'

const Home = () => {
  const { handleGetSong, song } = useSong()

  // Song categories derived from context
  const happySongs = song?.happy || []
  const neutralSongs = song?.neutral || []
  const favSongs = song?.favorites || []

  return (
    <div className="home-layout">
      {/* Premium Navbar */}
      <nav className="navbar">
        <div className="logo">
          <LayoutGrid className="icon" />
          <span>VIBE.AI</span>
        </div>
        <div className="nav-links">
          <span>Discover</span>
          <span>Library</span>
          <span className="premium">Go Pro</span>
        </div>
        <div className="nav-profile">
          <Search size={18} />
          <User size={18} />
        </div>
      </nav>

      <main className="bento-container">
        {/* Left Side: Fixed AI Scanner */}
        <aside className="scanner-card-wrapper">
          <FaceExpression
            onClick={(expression) => {
              handleGetSong({ mood: expression })
            }}
          />
        </aside>

        {/* Right Side: Bento Music Sections */}
        <section className="content-grid">
          <div className="welcome-header">
            <h1>Tailored For You</h1>
            <p>AI-generated playlists based on your current expression.</p>
          </div>

          <div className="music-stack">
            <div className="bento-item">
              <div className="section-label"><Sparkles size={16}/> Happy Vibes</div>
              <MusicCards title="" songs={happySongs} />
            </div>

            <div className="bento-item">
              <div className="section-label"><Zap size={16}/> Neutral Focus</div>
              <MusicCards title="" songs={neutralSongs} />
            </div>

            <div className="bento-item">
              <div className="section-label"><Heart size={16}/> Your Favorites</div>
              <MusicCards title="" songs={favSongs} />
            </div>
          </div>
        </section>
      </main>

      <footer className="player-dock">
        <Player />
      </footer>
    </div>
  )
}

export default Home